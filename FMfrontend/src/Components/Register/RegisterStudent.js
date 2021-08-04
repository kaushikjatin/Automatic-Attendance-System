/* eslint-disable react/jsx-pascal-case */
import React, { useState } from 'react';
import Avatar from 'react-avatar-edit';
import { Button, Col, Row } from 'react-bootstrap';
import { Control, LocalForm } from 'react-redux-form';
import { Label } from 'reactstrap';
import Message from '../Message';
import MyWebcam from '../MyWebCam';

function RegisterStudent(props) {
    const [preview, setpreview] = useState(null);
    const [image, setimage] = useState([]);
    const [errorMessage, seterrorMessage] = useState("");
    function handleImage(images) {
      setimage(images);
    }
    function onClose() {
      setpreview(null);
    }
    function onCrop(preview) {
      setpreview(preview);
    }    
    async function StudentRegisterHandler(val, e) {
      e.preventDefault();
      if (val.password.length < 8)
        seterrorMessage("Password must be of length 8");
      else if (val.password !== val.password2)
        seterrorMessage("Password do not Match");
      else if (val.rollNo.toString().length !== 11)
        seterrorMessage("Wrong Roll no");
      else if (image.length < 6)
        seterrorMessage("Please at least select 6 photos");
      else {
        // const msg = { seterror, setloading, setsuccess };
        seterrorMessage("");
        const student = JSON.parse(JSON.stringify(val));
        student.role = 0; //0=STUDENT
        student.profilePic = preview;
        // console.log(preview)
        student.images =[...image];
        console.log(student);
        await props.handleRegister(student);
      }
    }
    return (
      <>
              <LocalForm
                onSubmit={(values, e) => StudentRegisterHandler(values, e)}
              >
                <>
                  <Row className="form-group justify-content-center">
                    <Col>
                      <Label htmlFor="image">Profile Pic:</Label>
                      <Avatar
                        shadingColor="white"
                        // cropRadius="100%"
                        width='100%'
                        height={295}
                        onCrop={onCrop}
                        onClose={onClose}
                        // src={profilePic}
                        // img={profilePic}
                        label='Choose a Photo'
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
                </>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="rollNo">Roll No.</Label>
                    <Control.text
                      type="number"
                      model=".rollNo"
                      id="rollNo"
                      name="rollNo"
                      placeholder="rollNo"
                      className="form-control"
                      required
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="branch">Branch Code</Label>
                    <Control.text
                      type="number"
                      model=".branch"
                      id="branch"
                      name="branch"
                      placeholder="branch"
                      className="form-control"
                      required
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="yearOfStart">year of admission</Label>
                    <Control.text
                      type="number"
                      model=".yearOfStart"
                      id="yearOfStart"
                      name="yearOfStart"
                      placeholder="yearOfStart"
                      className="form-control"
                      required
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h4>Upload photos</h4>
                    <h6 className="text-muted">Select 6 photos</h6>
                    <h6 className="text-muted">Click a photo to select it</h6>
                    <MyWebcam handleImage={handleImage} />
                  </Col>
                </Row>
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
                      <br/>
                    <Button type="submit" color="primary">
                      Register
                    </Button>
                  </Col>
                </Row>
              </LocalForm>
        
      </>
    );
  }

export default RegisterStudent;
