import React, { memo, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarHeader,
  SubMenu,
} from "react-pro-sidebar";
import { useDispatch } from "react-redux";
import sidebarBg from "../bg1.jpg";
import Loader from "../Components/Loader";
import ModalMessage from '../Components/ModalMessage'
import "../NavStyle.scss";
import { userLogout } from "../redux/actions/authAction";
import "./navbar.css";
import {AiOutlineLogout} from 'react-icons/ai'
const MySubMenu = (props) => {
  return (
    <SubMenu title={props.name} icon={props.icon}>
      {props.data.map((data,idx) =>
        data.type === "submenu" ? (
          <MySubMenu key={idx}
            setcomp={props.setcomp}
            {...data}
          />
        ) : (
          <MenuItem key={idx}
            onClick={() => {
              props.setcomp(data.compName);
              if (data.onClick) data.onClick();
            }}
          >
            {data.name}
          </MenuItem>
        )
      )}
    </SubMenu>
  );
};
const UserPage = (props) => {
  const { isMobile, userHandle, setcomp,loading,error,success,setloading,setsuccess,seterror } = props;
  function DispComponent({ state }) {
    return <>{props.compEnum[state]}</>;
  }
  const dispatch = useDispatch()
  console.log(props)
  return (
    <>
      <Row>
        <Col md="auto">
          <ProSidebar
            image={sidebarBg}
            collapsedWidth="0px"
            style={{height:'90vh'}}
            collapsed={isMobile ? props.showNav : false}
            className={isMobile ? "sidenav" : ""}
            id={isMobile ? "mySidenav" : ""}
          >
            {isMobile ? (
              <span
                class="closebtn"
                style={{ cursor: "pointer" }}
                onClick={() => props.setshowNav(!props.showNav)}
              >
                &times;
              </span>
            ) : (
              <></>
            )}

            <SidebarHeader>
              <div
                style={{
                  padding: "24px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 14,
                  letterSpacing: "1px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userHandle}
              </div>
            </SidebarHeader>
            <SidebarContent>
              <Menu iconShape="circle">
                {props.item.map((item,idx) => {
                  return item.type === "menu" ? (
                    <MenuItem key={idx}
                      icon={item.icon}
                      onClick={() => {
                        setcomp(item.compName);

                        if (props.onClick) props.onClick();
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ) : (
                    <MySubMenu
                      setcomp={setcomp}
                      {...item}
                    />
                  );
                })}
              </Menu>
              <Menu iconShape='circle'>
                <MenuItem
                  icon={<AiOutlineLogout />}
                  onClick={()=>
                    dispatch(userLogout({ role: props.role }))}
                  >Logout</MenuItem>
              </Menu>
            </SidebarContent>
          </ProSidebar>
        </Col>
        <Col>
          <DispComponent state={props.comp} />
        </Col>
      </Row>
      {loading ? (
        <ModalMessage
          isOpen={loading}
          toggle={() => setloading(!loading)}
          header="Profile"
          variant="none"
        >
          <Loader />
        </ModalMessage>
      ) : success!=null ? (
        <ModalMessage
          isOpen={success!=null}
          toggle={() => setsuccess(null)}
          header="Profile"
          variant="success"
        >
          {success}
        </ModalMessage>
      ): error != null ? (
        <ModalMessage
          isOpen={error != null}
          toggle={() => seterror(null)}
          header="Profile"
          variant="danger"
        >
          {error}
        </ModalMessage>
      )  : (
        <></>
      )}
    </>
  );
};

// export default memo(UserPage,(prevProps,nextProps)=>{
//   // console.log(prevProps)
//   // console.log(nextProps)
//   return prevProps.showNav!==nextProps.showNav
// });;
export default UserPage
