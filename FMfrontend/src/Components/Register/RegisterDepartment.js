/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import { Button, Col, Form, Row } from "react-bootstrap";
import { CgAdd } from "react-icons/cg";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Control, LocalForm } from "react-redux-form";
import { Label } from "reactstrap";
import Message from "../Message";

const RegisterDepartment = (props) => {
  const [preview, setpreview] = useState(null);
  const [branch, setbranch] = useState([""]);
  const [errorMessage, seterrorMessage] = useState("");
  function onClose() {
    setpreview(null);
  }
  function onCrop(preview) {
    setpreview(preview);
  }
  function TeacherRegisterHandler(val, e) {
    e.preventDefault();
    if (val.password.length < 8)
      seterrorMessage("Password must be of length 8");
    else if (val.password !== val.password2)
      seterrorMessage("Password do not Match");
    else {
      seterrorMessage("");
      props.handleRegister({
        ...val,
        role: 2,
        profilePic: preview,
        branch: branch,
      });
    }
  }
  return (
    <>
        
            <LocalForm
              onSubmit={(values, e) => {
                e.preventDefault();
                TeacherRegisterHandler(values, e);
              }}
            >
              <>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="image">Profile Pic:</Label>
                    <Avatar
                    width='100%'
                    height={295}
                      onCrop={onCrop}
                      onClose={onClose}
                    />
                    <img src={preview} alt="Preview" />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="email">Email</Label>
                    <Control.text
                      model=".email"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email"
                      className="form-control"
                      required
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="firstname">Name</Label>
                    <Control.text
                      model=".name"
                      id="name"
                      name="name"
                      placeholder="name"
                      className="form-control"
                      required
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="password">Password</Label>
                    <Control.text
                      model=".password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="password"
                      type="password"
                      required
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="password">RetypePassword</Label>
                    <Control.text
                      model=".password2"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="password"
                      type="password"
                      required
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label htmlFor="branch">Branch Code</Label>
                    <Button
                      onClick={() => {
                        var br = [...branch, ""];
                        setbranch(br);
                      }}
                    >
                      <CgAdd />
                    </Button>
                    {branch.map((branchCode, idx) => (
                      <Row className='py-2'>
                      <Col>
                        <Form.Control
                          type="number"
                          value={branchCode}
                          min={1}
                          onChange={(e) => {
                            var br = [...branch];
                            br[idx] = e.target.value;
                            setbranch(br);
                          }}
                          required
                        /></Col>
                        <Col>
                        <Button
                          onClick={() => {
                            var br = [...branch];
                            br.splice(idx, 1);
                            setbranch(br);
                          }}
                        >
                          <RiDeleteBin6Line />
                        </Button></Col>
                        <br/>
                      </Row>
                    ))}
                  </Col>

                </Row>
              </>
              <Row>
                <Col>
                  {errorMessage.length > 0 ? (
                    <Message variant="danger">{errorMessage}</Message>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button type="submit" color="primary">
                    Register
                  </Button>
                </Col>
              </Row>
            </LocalForm>
    </>
  );
};
export default RegisterDepartment;
