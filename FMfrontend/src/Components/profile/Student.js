/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-unused-vars */
import React, {  useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Row, Col,  Button} from "react-bootstrap";
import { LocalForm, Control } from "react-redux-form";
import { Label } from "reactstrap";
import Message from '../Message';
import Avatar from 'react-avatar-edit'
import Loader from '../Loader'
import ModalMessage from '../ModalMessage'
import { updateUser } from '../../redux/actions/authAction';
const StudentProfile=(props)=>{
  const dispatch = useDispatch()
  const [error,seterror]=useState(null)
  const [loading,setloading]=useState(false)
  const [success,setsuccess]=useState(false)
    const {user}=useSelector(state=>state.auth)
    // console.log(user)
    // console.log('hlo')
    const [profilePic, setprofilePic] = useState(
      user&&user.profilePic
        ? `data:${user.profilePic.contentType};base64,${new Buffer(
            user.profilePic.data.data,
            "base64"
          ).toString("base64")}`
        : null
    );
    const [preview, setpreview] = useState(null)
    const [errorMessage, seterrorMessage] = useState("");
    if(!user)
        return (
            <>Login first.</>
        )
    
    function onClose() {
        setpreview( null)
    }
    
    function onCrop(preview) {
        setpreview(preview)
    }
    async function updateProfile(value){
      const msg={seterror,setloading,setsuccess}
      seterrorMessage("");
        const val={...value,role:0,profilePic:preview}
        msg.setloading(true)
        const err=await dispatch(updateUser(val))
        msg.setloading(false)
        if(err==null)
          msg.setsuccess(true)
        else
          msg.seterror(err)
    }
    return(
        <>
        <LocalForm
            onSubmit={(values, e) => {e.preventDefault(); updateProfile(values)}}
          >
            <Row className="form-group">
              <Col>
                <Label htmlFor="image">Profile Pic:</Label>
                <Avatar
                    width={"100%"}
                    height={295}
                    onCrop={onCrop}
                    onClose={onClose}
                    src={profilePic}
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
                  defaultValue={user.email}
                  disabled={true}
                />
              </Col>
              
            </Row>
            <Row>
              <Col>
              {user.verified===false?<>
            <Button onClick={()=>{props.history.push(`/verifyAccount/${user.role}`,{email:user.email,role:user.role,loggedIn:true})}}>Verify Account</Button>
          </>:<><span className='alert alert-success' style={{width:'100%'}}>Verified</span><br/><br/></>}
            
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
                  defaultValue={user.name}
                  required
                />
              </Col>
            </Row>
            <Row className="form-group">
              <Col>
                <Label htmlFor="rollNo">Roll No.</Label>
                <Control.text
                type='number'
                  model=".rollNo"
                  id="rollNo"
                  name="rollNo"
                  placeholder="rollNo"
                  className="form-control"
                  defaultValue={user.rollNo}
                  disabled={true}
                  required
                />
              </Col>
            </Row>
            <Row className="form-group">
              <Col>
                <Label htmlFor="branch">Branch Code</Label>
                <Control.text
                type='number'
                  model=".branch"
                  id="branch"
                  name="branch"
                  placeholder="branch"
                  className="form-control"
                  defaultValue={user.branch}
                  disabled={true}
                  required
                />
              </Col>
            </Row><Row className="form-group">
              <Col>
                <Label htmlFor="yearOfStart">Year of Start</Label>
                <Control.text
                type='number'
                  model=".yearOfStart"
                  id="yearOfStart"
                  name="yearOfStart"
                  placeholder="yearOfStart"
                  className="form-control"
                  defaultValue={user.yearOfStart}
                  disabled={true}
                  required
                />
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
                <Button type="submit" color="primary">
                  Update Profile
                </Button>
              </Col>
            </Row>
          </LocalForm>
          {loading?<ModalMessage isOpen={loading} toggle={()=>setloading(!loading)} header='Registration' variant='none'>
        <Loader/>
      </ModalMessage>:error!=null?<ModalMessage isOpen={error!=null} toggle={()=>seterror(null)} header='Registration' variant='danger'>
        {error}
      </ModalMessage>:success?<ModalMessage isOpen={success} toggle={()=>setsuccess(!success)} header='Registration' variant='success'>
        Profile Updated
      </ModalMessage>:<></>}
        </>
    )
}
export default StudentProfile;