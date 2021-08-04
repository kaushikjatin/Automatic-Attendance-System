const createError = require("http-errors");
const { teacher, student } = require("../modals/user");
const subject = require("../modals/subject");
const { classModal, sectionModal } = require("../modals/classModal");
const {
  studentRegisterValidator,
  teacherRegsiterValidator,
} = require("../validators/authvalidation");
// const {regsiterValidator,loginValidator}=require('../validator/validation')

// function to add a new class
// accessible by admin only
// students will be [] now and will be added later by students only

//TO BE CHANGED
exports.addClass = async (req, res, next) => {
  /* data sent by admin
        branchCode:[branch code],
        yearOfStart:year of start,
        teachers: [emailId],   all the teachers that will teach the class
        section: [
            name:section name
            students:[rollno]      roll no of students of this section
            attendance:{
                teacher:email,
                subject:subject code,
            }
        ]
    */
  try {
    // Gathering all the data from req.body
    var error = "";
    const { branchCode, yearOfStart } = req.body;
    var teachers = [];
    var students = [];
    if (!branchCode || !yearOfStart)
      return next(createError[422]("branch code and year of start required"));
    if (req.user.branch.indexOf(branchCode) == -1)
      return next(
        createError.Unauthorized(
          "You can't add a class outside your branch codes"
        )
      );
    // adding any and all section
    var section = undefined;
    if (req.body.section && req.body.section.length > 0) {
      section = await req.body.section.map(async (sec) => {
        var s = {};
        s.name = sec.name;
        s.students = await sec.students.map(async (roll) => {
          var stud = await student.findOne({ rollNo: roll });
          if (stud && stud.verified == false)
            error += `${roll} is not verified.Please verify the student first<br/>`;
          else if (stud) return await stud._id;
          else
            error += `${roll} does not exist in database.Please register the student first<br/>`;
        });
        s.students = await Promise.all(s.students);
        s.students = s.students.filter((a) => a); //removing undefined /error students
        var studentString = s.students.map((a) => a.toString());
        students = [...new Set([...students, ...studentString])];
        s.attendance = await sec.attendance.map(async (att) => {
          var teach = await teacher.findOne({ email: att.teacherId });
          if (!teach) {
            error += `${att.teacherId} does not exist in database.Please register the teacher first\n`;
            return undefined;
          }
          var subj = await subject.findOne({ code: att.subjectId });
          if (!subj) {
            error += `${att.subjectId} does not exist in database.Please register the subject first\n`;
            return undefined;
          }

          return { teacherId: await teach._id, subjectId: await subj._id };
        });
        s.attendance = await Promise.all(s.attendance);
        s.attendance = s.attendance.filter((a) => a);
        var secTeach = s.attendance.map((a) => a.teacherId.toString());
        teachers = [...new Set([...secTeach, ...teachers])];
        return s;
      });
      //   console.log(await section)
      section = await Promise.all(section);
      section = section.filter((a) => a); //removing undefined
    }

    const Class = await classModal.findOne({ branchCode, yearOfStart });
    if (Class) return next(createError[422]("class already exists"));
    else {
      const result = await classModal.create({
        branchCode,
        yearOfStart,
        section,
        students,
        teachers,
      });
      return res.send({ ...result._doc, error });
    }
  } catch (err) {
    console.log(err);
    if (typeof err === "string") next(createError[500](err));
    else next(createError[500](err.message));
  }
  return next(createError[500](error));
};
exports.editClass = async (req, res, next) => {
  //function to edit a already existing class
  /*data required
        branchCode,
        yearOfStart,
        sections:[
            name,
            students:[rollNo]   //all rollNo.
            attendance:[
                teacherId,
                subjectId
            ]
        ]
    */
  var error = "";
  const { branchCode, yearOfStart } = req.body;
  var teachers = [];
  var students = [];
  var section = undefined;
  try {
    if (!branchCode || !yearOfStart)
      return next(createError[422]("branch code and year of start required"));
    if (req.user.branch.indexOf(branchCode) == -1)
      return next(
        createError.Unauthorized(
          "You can't add a class outside your branch codes"
        )
      );
    var section = undefined;
    if (req.body.section && req.body.section.length > 0) {
      section = await req.body.section.map(async (sec) => {
        var s = {};
        s.name = sec.name;
        s.students = await sec.students.map(async (roll) => {
          var stud = await student.findOne({ rollNo: roll });
          if (stud && stud.verified == false)
            error += `${roll} is not verified.Please verify the student first\n`;
          else if (stud) return await stud._id;
          else
            error += `${roll} does not exist in database.Please register the student first\n`;
        });
        s.students = await Promise.all(s.students);
        s.students = s.students.filter((a) => a); //removing undefined /error students
        var studentString = s.students.map((a) => a.toString());
        students = [...new Set([...students, ...studentString])];
        s.attendance = await sec.attendance.map(async (att) => {
          var teach = await teacher.findOne({ email: att.teacherId });
          if (!teach) {
            error += `${att.teacherId} does not exist in database.Please register the teacher first\n`;
            return undefined;
          }
          var subj = await subject.findOne({ code: att.subjectId });
          if (!subj) {
            error += `${att.subjectId} does not exist in database.Please register the subject first\n`;
            return undefined;
          }

          return { teacherId: await teach._id, subjectId: await subj._id };
        });
        s.attendance = await Promise.all(s.attendance);
        s.attendance = s.attendance.filter((a) => a);
        var secTeach = s.attendance.map((a) => a.teacherId.toString());
        teachers = [...new Set([...secTeach, ...teachers])];
        return s;
      });
      //   console.log(await section)
      section = await Promise.all(section);
      section = section.filter((a) => a); //removing undefined
    }
    const Class = await classModal.findOne({ branchCode, yearOfStart });
    if (!Class) return next(createError[422]("class not found"));
    else {
      Class.section = section;
      Class.teachers = teachers;
      Class.students = students;
      const result = await Class.save();
      return res.send({ ...result._doc, error });
    }
  } catch (err) {
    console.log(err);
    if (typeof err === "string") next(createError[500](err));
    else next(createError[500](err.message));
  }
};
//CHANGE A LOT HERE POPULATE ERROR DATE ERROR ETC
exports.seeClass = async (req, res, next) => {
  const { branchCode, yearOfStart } = req.query;
  if (!branchCode || !yearOfStart)
    return next(createError[422]("branchCode and yearOfStart needed"));
  try {
    var result = await classModal
      .findOne({ branchCode, yearOfStart })
      .populate("students")
      .populate("teachers")
      .populate("section.students")
      .populate("section.attendance.teacherId")
      .populate("section.attendance.subjectId")
      .populate("section.attendance.attendance.presentStudent");
    if (!req.query.sectionName) {
      // console.log(result)
      var re;
      re = result.section.map((sec) => {
        // console.log(sec.name)
        var obj = {};
        obj.name = sec.name;
        obj.students = sec.students.map((st) => st.rollNo);
        // console.log(sec.students.map(st=>st.rollNo))
        console.log(obj);
        obj.attendance = sec.attendance.map((att) => {
          // console.log(att)
          var a = {
            teacherId: att.teacherId.email,
            subjectId: att.subjectId.code,
          };
          return a;
        });
        // console.log(sec)
        return obj;
      });
      return res.send({
        branchCode: result.branchCode,
        yearOfStart: result.yearOfStart,
        section: re,
      });
    }
    var section = result.section.find(
      (section) => section.name === req.query.sectionName
    );
    if (!section) return next(createError[422]("Section not found"));
    if (!req.query.subjectCode) return res.send(section);
    var attendance = section.attendance.find(
      (sec) => sec.subjectId.code === req.query.subjectCode.toUpperCase()
    );
    if (!attendance)
      return next(createError[422]("subject not found in this section"));
    if (!req.query.date) {
      const st = section.students.map((stu) => {
        return { name: stu.name, rollNo: stu.rollNo };
      });
      attendance = {
        totalStudent: st,
        teacher: attendance.teacherId.name,
        subject: attendance.subjectId.name,
        attendance: attendance.attendance.map((at) => {
          const st = at.presentStudent.map((stu) => {
            return { name: stu.name, rollNo: stu.rollNo };
          });
          return {
            date: at.date,
            presentStudent: st,
          };
        }),
      };
      return res.send(attendance);
    }
    // console.log(attendance)
    var attendanceOnDate = attendance.attendance.find(
      (att) => att.date.toString() === req.query.date.toString()
    );
    if (!attendanceOnDate)
      return next(createError[422]("No class on this date"));
    if (!req.query.rollNo) {
      attendanceOnDate = attendanceOnDate.presentStudent.map((at) => {
        return { name: at.name, rollNo: at.rollNo };
      });
      return res.send(attendanceOnDate);
    }
    const pst = attendanceOnDate.presentStudent.find(
      (at) => at.rollNo.toString() == req.query.rollNo.toString()
    );
    if (!pst) return res.send({ present: false });
    else return res.send({ present: true });
  } catch (err) {
    console.log(err);
    if (typeof err == "string") return next(createError[400](err));
    else return next(createError[400]("Incorrect data sent"));
  }
};
exports.deleteClass = async (req, res, next) => {
  /* data sent by admin
        branchCode:branch code,
        yearOfStart:year of start,
        teachers: [emailId],   all the teachers that will teach the class
        section: [
            name:section name
            students:[rollno]      roll no of students of this section
            attendance:{
                teacher:email,
                subject:subject code,
            }
        ]
    */
  try {
    const { branchCode, yearOfStart } = req.body;
    if (!branchCode || !yearOfStart)
      return next(createError[422]("branch code and year of start required"));
      console.log(req.user)
      // console.log()
    if (req.user.branch.indexOf(branchCode) == -1)
      return next(
        createError.Unauthorized("You can't delete a class outside your branch")
      );
    const Class = await classModal.findOne({ branchCode, yearOfStart });
    if (!Class) return next(createError[422]("class not found.Try Again"));
    else {
      const result = await classModal.findOneAndDelete({
        branchCode,
        yearOfStart,
      });
      return res.send({ success: true });
    }
  } catch (err) {
    console.log(err);
    if (typeof err === "string") next(createError[500](err));
    else next(createError[500](err.message));
  }
  return next(createError[500](error));
};
//for graphs
exports.studentPresentInClass = async (req, res, next) => {
  const { branchCode, yearOfStart, sectionName, subjectCode } = req.query;
  /*Student has logged in and wants to check it's attendance percentage in a perticular subject */
  if (!branchCode || !yearOfStart || !sectionName || !subjectCode)
    return next(createError[422]("Please enter all details"));
  try {
    const Class = await classModal
      .findOne({ branchCode, yearOfStart })
      .populate("section.attendance.subjectId");
    if (!Class) return next(createError[422]("class not found"));
    var section = Class.section.find((se) => se.name == sectionName);
    if (!section) return next(createError[422]("section not found"));
    var attendance = section.attendance.find(
      (at) => at.subjectId.name === subjectCode.toUpperCase()
    );
    if (!attendance) return next(createError[422]("subject not found"));
    var present = attendance.attendance.reduce((present = 0, students) => {
      if (students.presentStudent.indexOf(req.user._id) > 0) present += 1;
    });
    return res.send({
      present: present,
      totalClass: attendance.attendance.length,
    });
  } catch (err) {
    console.log(err);
    if (typeof err == "string") return next(createError[400](err));
    else return next(createError[400]("Incorrect data sent"));
  }
};

//Needs to be changed Urgent
//on line 340 section.attendance.subjectId populate
async function teacherData(req) {
  //teacher has logged in.
  //teacher data in req.user
  var classes = await classModal.find();
  // console.log(classes)
  classes = classes.filter((Class) => {
    return Class.teachers.indexOf(req.user._id) != -1;
  });
  classes = classes.map(async (classs) => {
    var Class = await classs
      .populate("section.attendance.subjectId", "code")
      .execPopulate();
    // var Class=await Promise.all(...Class)
    // return Class
    // console.log(Class)
    var cl = {};
    cl.branchCode = Class.branchCode;
    cl.yearOfStart = Class.yearOfStart;
    cl.section = Class.section.map((sec) => {
      var att = sec.attendance.filter((att) => {
        // console.log(att)
        return (
          att.teacherId && att.teacherId.toString() == req.user._id.toString()
        );
      });
      att = att.map((at) => {
        // if(at.subject)
        return at.subjectId.code;
      });
      if (att.length > 0) {
        return { name: sec.name, subject: att };
      } else return null;
    });

    cl.section = cl.section.filter((s) => s != null);
    // cl=cl.filter(cl.section.length>0)
    if (cl.section.length > 0) return cl;
  });
  classes = await Promise.all(classes);
  classes = classes.filter((cl) => cl != null);
  // console.log(classes)
  return classes;
}
async function studentData(req) {
  //teacher has logged in.
  //teacher data in req.user
  var classes = await classModal.find();
  // console.log(classes)
  classes = classes.filter((Class) => {
    return Class.students.indexOf(req.user._id) != -1;
  });
  classes = classes.map(async (classs) => {
    var Class = await classs
      .populate("section.attendance.subjectId","code")
      .execPopulate();
    // var Class=await Promise.all(...Class)
    // return Class
    // console.log(Class)
    var cl = {};
    cl.branchCode = Class.branchCode;
    cl.yearOfStart = Class.yearOfStart;
    cl.section = Class.section.map((sec) => {
      if (sec.students.indexOf(req.user._id.toString()) != -1) {
        var s = {};
        s.name = sec.name;
        s.subject = sec.attendance.map((att) => {
          return att.subjectId.code 
        });
        if (s.subject.length == 0) return null;
        return s;
      } else return null;
    });

    cl.section = cl.section.filter((s) => s != null);
    // cl=cl.filter(cl.section.length>0)
    if (cl.section.length > 0) return cl;
  });
  classes = await Promise.all(classes);
  classes = classes.filter((cl) => cl != null);
  // console.log(classes)
  return classes;
}
exports.getDataforDropdown = async (req, res, next) => {
  console.log(req.user)
  if (req.query.teacherData == "1") {
    const response = await teacherData(req);
    // console.log(response)
    return res.send(response);
  }
  if (req.query.studentData == "0") {
    const response = await studentData(req);
    // console.log(response)
    return res.send(response);
  }
  const { branchCode, yearOfStart, sectionName, subjectCode } = req.query;
  if (!branchCode || (typeof branchCode == "object" && branchCode.length == 0))
    return next(createError[422]("Please send branch code"));
  try {
    if (!yearOfStart) {
      var cl = await classModal.find({ branchCode });
      cl = cl.map((a) => {return {branchCode:a.branchCode,yearOfStart:a.yearOfStart}});
      return res
      .send(cl);
    }
    var Class = await classModal
      .findOne({ branchCode, yearOfStart })
      .populate("teachers")
      .populate("section.students")
      .populate("section.attendance.teacherId")
      .populate("section.attendance.subjectId")
      .populate("section.attendance.attendance.presentStudent");
    if (!Class) return res.send([]);
    if (!sectionName) {
      const section = Class.section.map((se) => se.name);
      return res.send(section);
    }
    const section = Class.section.find((se) => se.name === sectionName);
    if (!section) return res.send([]);
    const teacher_subject = section.attendance.map((at) => {
      return { teacher: at.teacherId.name, subject: at.subjectId.name };
    });
    return res.send(teacher_subject);
  } catch (err) {
    console.log(err);
    if (typeof err == "string") return next(createError[400](err));
    else return next(createError[400]("Incorrect data sent"));
  }
};
