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
import { seeAttendance } from "../redux/actions/attendance";

export const SeeAttendanceForm=({setdata})=>{
    const dispatch = useDispatch()
    const [error,seterror]=useState(null)
    const [loading,setloading]=useState(false)
    const [success,setsuccess]=useState(false)
    async function seeAttendanceHandler(val, e) {
      
        e.preventDefault();
        const msg={seterror,setloading,setsuccess}
        // seterrorMessage("");
        msg.setloading(true)

        //DISPATCH THING HERE
        val={...val}  //removing the read only property.
        val.subjectCode=val.subjectCode.toUpperCase()
        // console.log(val)
        const response=await dispatch(seeAttendance(val))
        msg.setloading(false)
        if(response.success!==false){
            setdata(response)
            // msg.setsuccess({...response,success:undefined})
        }
        else{
            console.log(response.err)
            msg.seterror(response.err)
        }
    }
    return(
        <>
      <>
        <>
          <h1>See Attendance</h1>
          <LocalForm
            onSubmit={(values, e) => {e.preventDefault(); seeAttendanceHandler(values, e)}}
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
                  style={{textTransform:'uppercase'}}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </Col>
            </Row>
          </LocalForm>
        </>
      </>
    {loading?<ModalMessage isOpen={loading} toggle={()=>setloading(!loading)} header='Registration' variant='none'>
        <Loader/>
      </ModalMessage>:error!=null?<ModalMessage isOpen={error!=null} toggle={()=>seterror(null)} header='Registration' variant='danger'>
        {error}
      </ModalMessage>:success?<ModalMessage isOpen={success} toggle={()=>setsuccess(!success)} header='Registration' variant='success'>
        {JSON.stringify(success)}
      </ModalMessage>:<></>}
            <Row></Row>
        </>
    )
}
