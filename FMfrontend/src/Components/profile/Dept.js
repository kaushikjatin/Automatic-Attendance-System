/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Label } from "reactstrap";
import Avatar from "react-avatar-edit";
import {RiDeleteBin6Line} from 'react-icons/ri'
import {CgAdd} from 'react-icons/cg'
import { updateUser } from "../../redux/actions/authAction";
const DeptProfile = (props) => {
  const dispatch = useDispatch();
  var { user } = useSelector((state) => state.auth);
  const [newuser, setnewuser] = useState({ ...user,profilePic:
    user&&user.profilePic
      ? `data:${user.profilePic.contentType};base64,${new Buffer(
          user.profilePic.data.data,
          "base64"
        ).toString("base64")}`
      : null
      });
  const [preview, setpreview] = useState(null);
  const [errorMessage, seterrorMessage] = useState()
  if (!user) return <h1>Login first.</h1>;

  function onClose() {
    setpreview(null);
  }

  function onCrop(preview) {
    setpreview(preview);
  }
  async function updateProfile() {
    if(newuser.branch.length===0){
      seterrorMessage('Atleast one branch required')
      return;
    }
    seterrorMessage("");
    const val = { ...newuser, role: 2, profilePic: preview };
    // console.log(val)
    props.setloading(true);
    const err=await dispatch(updateUser(val))
    
    props.setloading(false);
    if (err == null){
      props.setsuccess('Profile Updated Successfully');
    }
    else props.seterror(err);
    return false;
  }
  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile()
          e.preventDefault()
        }}
      >
        <Row className="form-group">
          <Col>
            <Label htmlFor="image">Profile Pic:</Label>
            <Avatar
              width={"100%"}
              height={295}
              onCrop={onCrop}
              onClose={onClose}
              src={newuser.profilePic}
            />
            <img src={preview} alt="Preview" />
          </Col>
        </Row>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            value={newuser.email}
            onChange={(e) => setnewuser({ ...newuser, email: e.target.value })}
            required
            disabled={true}
          />
        </Form.Group>
        <Row>
          <Col>
            {user.verified === false ? (
              <>
                <Button
                  onClick={() => {
                    props.history.push(`/verifyAccount/${user.role}`, {
                      email: user.email,
                      role: user.role,
                      loggedIn:true
                    });
                  }}
                >
                  Verify Account
                </Button>
              </>
            ) : (
              <>
                <span className="alert alert-success" style={{ width: "100%" }}>
                  Verified
                </span>
                <br />
                <br />
              </>
            )}
          </Col>
        </Row>

        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={newuser.name}
            onChange={(e) => setnewuser({ ...newuser, name: e.target.value })}
            required
            disabled={false}
          />
        </Form.Group>
        <Form.Group controlId="branch">
          <Form.Label>Branch</Form.Label>
          <Button onClick={()=>{
            var br=[...newuser.branch,'']
            setnewuser({...newuser,branch:br})
          }}><CgAdd/></Button>
          {newuser.branch.map((branch,idx)=>(
            <>
            <Form.Control
            type="number"
            value={branch}
            min={1}
            onChange={(e) => {
              var br=[...newuser.branch];
              br[idx]=e.target.value
              setnewuser({...newuser,branch:br})
            }}
            required
            disabled={false}
          />
          <Button onClick={()=>{
            var br=[...newuser.branch]
            br.splice(idx,1)
            setnewuser({...newuser,branch:br})
          }}><RiDeleteBin6Line/></Button>
          </>
          ))}          
        </Form.Group>
        <Row>
          <Col>
            {errorMessage?<div className='alert alert-danger w-25 ' >{errorMessage}</div>:<></>}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button type="submit" color="primary">
              Update Profile
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default DeptProfile;
