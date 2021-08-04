import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RangeSelector, getListofRollNo } from "./RangeSelector";
import Loader from "./Loader";
import ModalMessage from "./ModalMessage";
import { addClass, deleteClass, editClass } from "../redux/actions/classAction";
import { Link } from "react-router-dom";
function rangeFromRollNo(rollNo){
  const range=[]
  rollNo.sort((a,b)=>a-b)
  if(!rollNo|| rollNo.length===0)
    return range;
  var i,start=rollNo[0];
  for(i=1;i<rollNo.length;i++){
    if(rollNo[i]==rollNo[i-1]+1)
      continue;
    else{
      range.push({starting:{value:start.toString()},ending:{value:rollNo[i-1].toString()}})
      start=rollNo[i];
    }
  }
  range.push({starting:{value:start.toString()},ending:{value:rollNo[i-1].toString()}})
  return range;
}
const AddSubject = ({ fields, setFields, pos }) => {
  // const [fields, setFields] = useState([]);

  function handleChange(i, position, event) {
    const values = JSON.parse(JSON.stringify(fields));
    if(position==='subjectId')
      values[pos][i][position] = event.target.value.toUpperCase();
    else
    values[pos][i][position] = event.target.value;
    setFields(values);
  }
  // console.log(pos)
  // console.log(fields)
  function handleAdd() {
    // alert(pos)
    const values = JSON.parse(JSON.stringify(fields));
    values[pos].push({
      teacherId: '',
      subjectId: '',
    });
    // console.log(values)
    setFields(values);
  }
  function handleRemove(i) {
    const values = JSON.parse(JSON.stringify(fields));
    values[pos].splice(i, 1);
    setFields(values);
  }
  return (
    <>
      {/* <h1>Hello CodeSandbox</h1> */}

      <Button type="button" onClick={() => handleAdd()}>
        Add Subject
      </Button>
      <br />
      {fields[pos]&&fields[pos].map((field, idx) => {
        // console.log(field)
        return (
          <span key={`${field}-${idx}`}>
            {
              <>
                <Form.Group controlId="teacher">
                  <Form.Label>Teacher</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="teacher email id"
                    value={field.teacherId || ""}
                    onChange={(e) => handleChange(idx, "teacherId", e)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="subject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="subject Code"
                    value={field.subjectId || ""}
                    onChange={(e) => handleChange(idx, "subjectId", e)}
                    required
                  />
                </Form.Group>

                <Button
                  type="button"
                  as="span"
                  onClick={() => handleRemove(idx)}
                >
                  Remove Subject
                </Button>
              </>
            }
          </span>
        );
      })}
    </>
  );
};
const AddSection = ({
  fields,
  setFields,
  rollNo,
  setrollNo,
  attendance,
  setattendance,
}) => {
  function handleChange(i, pos, event) {
    const values = JSON.parse(JSON.stringify(fields));
    values[i][pos].value = event.target.value;
    setFields(values);
  }

  function handleAdd() {
    const values = JSON.parse(JSON.stringify(fields));
    var temp = [...rollNo, []];
    setrollNo(temp);
    var temp2 = [...attendance, []];
    setattendance(temp2);
    values.push({
      name: { value: "" },
      students: { pos: temp.length - 1 },
      attendance: { pos: temp2.length - 1 },
    });
    setFields(values);
  }
  function handleRemove(i) {
    console.log(i);
    const values = JSON.parse(JSON.stringify(fields));
    values.splice(i, 1);
    setFields(values);
  }

  return (
    <>
      {/* <h1>Hello CodeSandbox</h1> */}
      <br />
      <Button type="button" onClick={() => handleAdd()}>
        Add section
      </Button>
      <br/>
      {fields.map((field, idx) => {
        //   console.log(field)
        return (
          <div key={`${field}-${idx}`}>
            {
              <>
                <Form.Group controlId="section name">
                  <Form.Label>Section Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Section Name"
                    value={field.name.value || ""}
                    onChange={(e) => handleChange(idx, "name", e)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="students">
                  <Form.Label>Students</Form.Label>
                  <RangeSelector
                    fields={rollNo}
                    setFields={setrollNo}
                    pos={field.students.pos}
                  />
                </Form.Group>
                <Form.Group controlId="subject">
                  <Form.Label>Subject</Form.Label>
                  <AddSubject
                    fields={attendance}
                    setFields={setattendance}
                    pos={field.attendance.pos}
                  />
                </Form.Group>
                <Button
                  type="button"
                  as="span"
                  onClick={() => handleRemove(idx)}
                >
                  Cancel Section
                </Button>
              </>
            }
          </div>
        );
      })}
    </>
  );
};
const AddClass = (props) => {
  console.log(props)
  const {Class}=props
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); //for getting branch Code
  const [section, setsection] = useState([{
    name: { value: "" },
    students: { pos: 0},
    attendance: { pos: 0 },
  }]);
  const [yearOfStart, setyearOfStart] = useState("");
  const [rollNo, setrollNo] = useState([[{
    starting: { value: null },
    ending: { value: null },
  }]]);
  const [branch, setbranch] = useState(Class?Class.branchCode:user.branch[0])
  const [attendance, setattendance] = useState([[{
    teacherId: '',
    subjectId: '',
  }]]);
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState(false);
  const [showMessage,setShowMessage]=useState('addClass')
  useEffect(() => {
    var Section=[],RollNo=[],Attendance=[];
    if(Class){
    Class.section.forEach((sec,idx)=>{
      var range=rangeFromRollNo(sec.students)
      Section.push({name:{value:sec.name},students:{pos:idx},attendance:{pos:idx}})
      RollNo.push(range)
      Attendance.push(sec.attendance)
    })
    setsection(Section)
    setrollNo(RollNo)
    setattendance(Attendance)
    setyearOfStart(Class.yearOfStart)
    setShowMessage('editClass')
  }
  }, [Class])
  const handleSubmit = async (e) => {
    //embedding rollno and attending inside section
    const finalSection = section.map((sec) => {
      var rollNopos = sec.students.pos;
      sec.students = getListofRollNo(rollNo[rollNopos]);
      sec.attendance = attendance[sec.attendance.pos];
      sec.name=sec.name.value
      return sec;
    });
    
    const class1 = {
      branchCode: branch,
      yearOfStart,
      section: finalSection,
    };

    // setrollNo([])
    // setattendance([])
    // setsection([])
    // e.preventDefault();
    const msg = { seterror, setloading, setsuccess };
    // seterrorMessage("");
    msg.setloading(true);

    //DISPATCH THING HERE
    console.log(class1)
     const response = Class==null?await dispatch(addClass(class1)):await dispatch(editClass(class1))
   
    console.log(response)
    msg.setloading(false);
    if (response.success === true){
        if(response.error)
            msg.setsuccess(response.error)
        else
            msg.setsuccess(true)
    }
    else msg.seterror(response.err);
    // console.log(error)
    // console.log(success)
  };
  async function removeClass(e){
    const class1={branchCode:Class.branchCode,yearOfStart:Class.yearOfStart}
    // console.log(class1)
    const msg = { seterror, setloading, setsuccess };
    // seterrorMessage("");
    msg.setloading(true);

    //DISPATCH THING HERE
    // console.log(val)
     const response = await dispatch(deleteClass(class1))
   
    console.log(response)
    msg.setloading(false);
    if (response.success === true){
        if(response.error)
            msg.setsuccess(response.error)
        else
            msg.setsuccess(true)
    }
    else msg.seterror(response.err);
    setShowMessage('deleteClass')
    // console.log(error)
    // console.log(success)
  }
  const message={
    addClass:<>Class is added. Go to <Link to={`/`}>home</Link> page</>,
    editClass:<>Class edited</>,
    deleteClass:<>Class deleted.</>
  }
  return (
    <>
            {Class===null?<h1>Add Class</h1>:<h1>Edit Class</h1>}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit()
              }}
            >
              <Form.Group controlId="branch Code">
                <Form.Label>Branch Code</Form.Label>
                <Form.Control as='select'
                  disabled={Class!==null}
                >
                  {Class!==null?<option>{Class.branchCode}</option>:<></>}
                  {user.branch.map(br=>(
                    <option onClick={()=>setbranch(br)}>{br}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="Year of Start">
                <Form.Label>Year of Start</Form.Label>
                <Form.Control
                  type="number"
                  value={yearOfStart}
                  onChange={(e) => setyearOfStart(e.target.value)}
                  required
                  disabled={Class!==null}
                />
              </Form.Group>
              <AddSection
                fields={section}
                setFields={setsection}
                rollNo={rollNo}
                setrollNo={setrollNo}
                attendance={attendance}
                setattendance={setattendance}
              />
              <Button  type="submit">{Class===null?<h3>Add Class</h3>:<h3>Edit Class</h3>}</Button>
              {Class===null?<></>:<Button onClick={()=>removeClass()}><h3>Remove Class</h3></Button>}
            </Form>
      {loading ? (
        <ModalMessage
          isOpen={loading}
          toggle={() => setloading(!loading)}
          header="Add a new Class"
          variant="none"
        >
          <Loader />
        </ModalMessage>
      ) : error != null ? (
        <ModalMessage
          isOpen={error != null}
          toggle={() => seterror(null)}
          header="Registration"
          variant="danger"
        >
          {error}
        </ModalMessage>
      ) : success ? (
        <>
          <ModalMessage
            isOpen={success}
            toggle={() => setsuccess(!success)}
            header="Registration"
            variant="success"
          >
            {message[showMessage]}
            <br />
            {success}
          </ModalMessage>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AddClass;
