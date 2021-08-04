import React, { useEffect, useState } from "react";
import { connect} from "react-redux";
import Dashboard from "../Components/Dashboard";
import { dropDown, viewClass } from "../redux/actions/classAction";
import UserPage from "./UserPage";
import { AiOutlineDashboard } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import AddClass from "../Components/AddClass";
import DeptProfile from "../Components/profile/Dept";
import AddSubject from "../Components/AddSubject";
import { FcManager } from "react-icons/fc";
import { MdSubject } from "react-icons/md";
import "../NavStyle.scss";
import "./navbar.css";
function DepttData(props){
  const [comp, setcomp] = useState("dashboard");
  const [particularClass, setparticularClass] = useState(null);
  const [classes, setclasses] = useState([]);
  const compEnum = {
    dashboard: <Dashboard />,
    addClass: <AddClass Class={null} />,
    editClass: <AddClass Class={particularClass}/>,
    profile: (
      <DeptProfile
        {...props}
        setsuccess={props.setsuccess}
        setloading={props.setloading}
        seterror={props.seterror}
      />
    ),
    addSubject: <AddSubject />,
    editSubject: <AddSubject Subject={particularClass} />,
  };
  console.log(particularClass)
  useEffect(() => {
    props
      .dropDown({
        branchCode: props.user.branch,
      })
      .then((response) => {
        if (response.success !== false)
          setclasses(response.class)
      });
  }, []);
  const renderEditClass = async (cl) => {
    var Class = await props.viewClass({
      branchCode: cl.branchCode,
      yearOfStart: cl.yearOfStart,
    });
    console.log(Class)
    if (Class.error) console.error(Class.error);
    else 
      setparticularClass(Class.class)
    
  };
  return (
    <>
      <UserPage
      role={2}
        compEnum={compEnum}
        comp={comp}
        setcomp={setcomp}
        isMobile={props.isMobile}
        showNav={props.showNav}
        setshowNav={props.setshowNav}
        userHandle="Department's Handle"
        loading={props.loading}
        success={props.success}
        error={props.error}
        setsuccess={props.setsuccess}
        setloading={props.setloading}
        seterror={props.seterror}
        heading={props.heading}
        setheading={props.setheading}
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
            icon: <FcManager />,
            data: [
              {
                type: "menu",
                compName: "addClass",
                name: "Add Class",
              },
              {
                type: "submenu",
                name: "Edit Class",
                data: classes.map((Class,idx) => {
                  return {
                    key:idx,
                    type: "menu",
                    name: (
                      <>
                        BranchCode:{Class.branchCode}
                        <br />
                        yearOfStart:{Class.yearOfStart}
                      </>
                    ),
                    compName: "editClass",
                    onClick: () => {
                      renderEditClass(Class);
                    },
                  };
                }),
              },
            ],
          },
          {
            type: "submenu",
            name: "Manage Subjects",
            icon: <MdSubject />,
            data: [
              {
                type: "menu",
                compName: "addSubject",
                name: "Add Subject",
              },
              {
                type: "menu",
                compName: "editSubject",
                name: "Edit Subject",
              },
            ],
          },
        ]}
      />
    </>
  );
}
export default connect(
  ( state=> {
    return { user: state.auth.user };
  }),
  (dispatch) => {
    return {
      dropDown: (val) => dispatch(dropDown(val)),
      viewClass: (val) => dispatch(viewClass(val)),
    };
  }
)(DepttData)