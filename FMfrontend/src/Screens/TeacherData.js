import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Dashboard from "../Components/Dashboard";
import { AddAttendanceForm } from "../Components/MarkAttendance";
import TeacherProfile from "../Components/profile/Teacher";
import SeeClass from "../Components/SeeClass";
import { dropDown } from "../redux/actions/classAction";
import UserPage from "./UserPage";
import { AiOutlineDashboard } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import {FcManager} from 'react-icons/fc'
const TeacherData = (props) => {
  const dispatch = useDispatch();
  const [comp, setcomp] = useState("dashboard");
  const [teacherClass, setteacherClass] = useState();
  const [Class, setClass] = useState({});
  useEffect(() => {
    (async function () {
      try {
        const data = await dispatch(dropDown({ teacherData: "1" }));
        setteacherClass(data.class);
      } catch (err) {
        console.log(err);
        setteacherClass(null);
      }
    })();
  }, [dispatch]);
  const compEnum = {
    dashboard: <Dashboard />,
    profile: <TeacherProfile {...props} />,
    markAttendance: <AddAttendanceForm Class={Class} />,
    seeClass: <SeeClass Class={Class} isMobile={props.isMobile} />,
  };
  return (
    <>
      <UserPage
      role={1}
        compEnum={compEnum}
        comp={comp}
        isMobile={props.isMobile}
        setcomp={setcomp}
        showNav={props.showNav}
        setshowNav={props.setshowNav}
        userHandle="Teacher Handle"
        item={[
          {
            type: "menu",
            name: "Dashboard",
            icon: <AiOutlineDashboard />,
            compName: "dashboard",
          },
          {
            type: "menu",
            name: "Profile",
            icon: <CgProfile />,
            compName: "profile",
          },
          {
            type: "submenu",
            name: "Manage Classes",
            icon:<FcManager/>,
            data: [
              {
                type: "submenu",
                name: "Mark Attendance",
                data: teacherClass
                  ? teacherClass.map((Class) => {
                      return {
                        type: "submenu",
                        name: (
                          <>
                            Branch:{Class.branchCode}
                            <br />
                            Year Of Start:{Class.yearOfStart}
                          </>
                        ),

                        data: Class.section.map((section) => {
                          return {
                            type: "submenu",
                            name: section.name,
                            data: section.subject.map((subject) => {
                              return {
                                type: "menu",
                                compName: "markAttendance",
                                onClick:()=>{setClass({
                                  branchCode: Class.branchCode,
                                  yearOfStart: Class.yearOfStart,
                                  sectionName: section.name,
                                  subjectCode: subject,
                                })},
                                name: subject,
                              };
                            }),
                          };
                        }),
                      };
                    })
                  : [],
              },
              {
                type: "submenu",
                name: "See Attendance",
                data: teacherClass
                  ? teacherClass.map((Class) => {
                      return {
                        type: "submenu",
                        name: (
                          <>
                            Branch:{Class.branchCode}
                            <br />
                            Year Of Start:{Class.yearOfStart}
                          </>
                        ),

                        data: Class.section.map((section) => {
                          return {
                            type: "submenu",
                            name: section.name,
                            data: section.subject.map((subject) => {
                              return {
                                type: "menu",
                                compName: "seeClass",
                                onClick:()=>{setClass({
                                  branchCode: Class.branchCode,
                                  yearOfStart: Class.yearOfStart,
                                  sectionName: section.name,
                                  subjectCode: subject,
                                })},
                                name: subject,
                              };
                            }),
                          };
                        }),
                      };
                    })
                  : [],
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default TeacherData;
