import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Dashboard from "../Components/Dashboard";
import SeeClass from "../Components/SeeClass";
import { dropDown } from "../redux/actions/classAction";
import UserPage from "./UserPage";
import { AiOutlineDashboard } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import {FcManager} from 'react-icons/fc'
import StudentProfile from "../Components/profile/Student";
const StudentData = (props) => {
  const dispatch = useDispatch();
  const [comp, setcomp] = useState("dashboard");
  const [studentClass, setstudentClass] = useState();
  const [Class, setClass] = useState({});
  useEffect(() => {
    (async function () {
      try {
        const data = await dispatch(dropDown({ studentData: "0" }));
        setstudentClass(data.class);
      } catch (err) {
        console.log(err);
        setstudentClass(null);
      }
    })();
  }, [dispatch]);
  const compEnum = {
    dashboard: <Dashboard />,
    profile: <StudentProfile {...props} />,
    seeClass: <SeeClass Class={Class} isMobile={props.isMobile} />,
  };
  console.log(studentClass)
  return (
    <>
      <UserPage
      role={0}
        compEnum={compEnum}
        comp={comp}
        isMobile={props.isMobile}
        setcomp={setcomp}
        showNav={props.showNav}
        setshowNav={props.setshowNav}
        userHandle="Student Handle"
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
                name: "See Attendance",
                data: studentClass
                  ? studentClass.map((Class) => {
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

export default StudentData;
