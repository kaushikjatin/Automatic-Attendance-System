import React, { memo, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import {  useSelector } from "react-redux";
import logo from "./logo.jpeg";
import { Link } from "react-router-dom";
const Header = (props) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <header>
      <Navbar variant="dark" bg="primary" collapseOnSelect>
        <Container fluid>
        {props.isMobile &&user ? (
                    <Row>
                      <Col>
                        <Button
                          onClick={() => props.setshowNav(!props.showNav)}
                        >
                          &#9776;
                        </Button>
                      </Col>
                    </Row>
                  ) : (
                    <></>
                  )}
            <Navbar.Brand className="" href="/">
              <img
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                src={logo}
                alt="logo"
              />
              <>One Click</>
            </Navbar.Brand>
          
            <Nav className="ml-auto">
              {user ? (
                <>
                  <Nav.Link> 
                    
                      <span className="pull-left">
                        {user.profilePic ? (
                          <img
                            className="thumbnail-image"
                            // src={user.profilePic}
                            src={
                              user.profilePic
                                ? `data:${
                                    user.profilePic.contentType
                                  };base64,${new Buffer(
                                    user.profilePic.data.data,
                                    "base64"
                                  ).toString("base64")}`
                                : null
                            }
                            alt="user pic"
                            style={{ height: "50px", width: "50px" }}
                          />
                        ) : (
                          <i className="fa fa-user" />
                        )}
                        {" " + user.name}
                      </span>
                    
                  
                    
                  </Nav.Link>
                  
                </>
              ) : (
                <> 
                <Nav.Link ><Link to='/login' className='font-weight-bold'>Login</Link></Nav.Link>
                <Nav.Link><Link to='/register' className='font-weight-bold'>Register</Link></Nav.Link>
                </>
              )}
            </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
