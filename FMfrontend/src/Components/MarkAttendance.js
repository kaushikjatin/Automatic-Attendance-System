/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import { Row, Col, Container, Button, Image } from "react-bootstrap";
import { LocalForm, Control } from "react-redux-form";
import { Label } from "reactstrap";
import Message from "./Message";
import {useDispatch, useSelector} from 'react-redux'
import { userRegister } from "../redux/actions/authAction";
import Loader from './Loader'
import ModalMessage from './ModalMessage'
import {Link} from 'react-router-dom'
import { markAttendance } from "../redux/actions/attendance";

export const AddAttendanceForm=({Class})=>{
  // const Class={branchCode:1,yearOfStart:2017,sectionName:'group1',subjectCode:'COD001A'}
    const dispatch = useDispatch()
    const [image, setimage] = useState([])
    const [error,seterror]=useState(null)
    const [loading,setloading]=useState(false)
    const [success,setsuccess]=useState(false)
    const [errorMessage, seterrorMessage] = useState("");
    const AttendanceImage=()=>{
        return(
            <>
                <Control.file
                    type='file'
                    model='.images'
                    id="image"
                    name="image"
                    multiple={true}
                    onChange={(e) => {
                      var im=[]
                      // console.log(e.target.files)
                      for(var i=0;i<e.target.files.length;i++)
                        im.push(URL.createObjectURL(e.target.files[i]))//.map(file=>URL.createObjectURL(im))
                      // console.log(im)
                      setimage(im);
                    }}
                />
                {
                  image.map((im,i)=>(
                    <>
                    <img
                      style={{ height: "100px", width: "100px" }}
                      src={im}
                      key={i}
                      alt="attendance"
                    />
                    {' '}
                    </>
                  ))
                }
            </>
        )
    }
    async function addAttendanceHandler(val, e) {
      if(val.images.length<=0)
        seterrorMessage('Choose images please')
      var i=0;
      for(i=0;i<val.images.length;i++){
        // console.log(val.images[i].type.split('/'));
        if(val.images[i].type.split('/')[0]!='image'){
          break;
        }
      }
      if(i!==val.images.length)
        seterrorMessage('Choose Images only.')
      else{
        e.preventDefault();
        const msg={seterror,setloading,setsuccess}
        // seterrorMessage("");
        msg.setloading(true)

        //DISPATCH THING HERE
        // console.log(val)
        const response=await dispatch(markAttendance({...val,...Class}))
        if(response.success==false){
          console.error(response.error)
          msg.seterror(response.error)
        }
        else
          msg.setsuccess(response.students)

        msg.setloading(false)
      }
    }
    return(
        <>
            <>
      <>
        <>
          <h1>Mark Attendance</h1>
          <LocalForm
            onSubmit={(values, e) => {e.preventDefault(); addAttendanceHandler(values, e)}}
          >
            <Row className="form-group">
              <Col>
                <Label htmlFor="branchCode">Branch Code</Label>
                <Control.text
                  model=".branchCode"
                  id="branchCode"
                  name="branchCode"
                  type="number"
                  placeholder="branchCode"
                  className="form-control"
                  required
                  disabled
                  // defaultValue={1}
                  value={Class.branchCode}
                />
              </Col>
            </Row>
            <Row className="form-group">
              <Col>
                <Label htmlFor="yearOfStart">Year of Start</Label>
                <Control.text
                  model=".yearOfStart"
                  id="yearOfStart"
                  name="yearOfStart"
                  type="number"
                  placeholder="yearOfStart"
                  className="form-control"
                  required
                  disabled
                  value={Class.yearOfStart}
                />
              </Col>
            </Row>
            <Row className="form-group">
              <Col>
                <Label htmlFor="sectionName">section Name</Label>
                <Control.text
                  model=".sectionName"
                  id="sectionName"
                  name="sectionName"
                  type="text"
                  placeholder="sectionName"
                  className="form-control"
                  required
                  disabled
                  value={Class.sectionName}
                />
              </Col>
            </Row>
            <Row className="form-group">
              <Col>
                <Label htmlFor="subjectCode">subject Code</Label>
                <Control.text
                  model=".subjectCode"
                  id="subjectCode"
                  name="subjectCode"
                  type="text"
                  placeholder="subjectCode"
                  className="form-control"
                  required
                  disabled
                  value={Class.subjectCode}
                />
              </Col>
            </Row>
            <Row className="form-group">
              <Col>
                <Label htmlFor="subjectCode">Date</Label>
                <Control.text
                  model=".date"
                  id="date"
                  name="date"
                  type="date"
                  placeholder="date"
                  className="form-control"
                  required
                />
              </Col>
            </Row>
            <Row className="form-group">
              <Col>
                <Label htmlFor="image">Attendance photos:</Label>
                </Col>
                </Row>
                <Row><Col>
                <AttendanceImage/>
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
                  Mark Attendance
                </Button>
              </Col>
            </Row>
          </LocalForm>
        </>
      </>
    </>
    {loading?<ModalMessage isOpen={loading} toggle={()=>setloading(!loading)} header='Mark Attendance' variant='none'>
        <Loader/>
      </ModalMessage>:error!=null?<ModalMessage isOpen={error!=null} toggle={()=>seterror(null)} header='Mark Attendance' variant='danger'>
        {error}
      </ModalMessage>:success?<ModalMessage isOpen={success} toggle={()=>setsuccess(!success)} header='Mark Attendance' variant='success'>
        Attendance is marked. <br/>
        RollNo of students present:
        <ol>
          {success.students.map(roll=><li>{roll}</li>)}
        </ol>
        All absentese will get a mail.
      </ModalMessage>:<></>}
            <Row></Row>
        </>
    )
}