import React, { useState } from "react";
import { Button, Card, CardImg, Col, Container, Form, Row } from "react-bootstrap";
import { CardHeader } from "reactstrap";
import {RangeSelector} from "../Components/RangeSelector";
import photo from './college.png'
import devansh from './devansh.jpg'
import jatin from './jatin.jpg'
const HomePage = () => {
  const features=[
    'Significantly improves efficiency of class by reducing the attendance time',
    'Reduces the chances of proxy to 0%',
    'Make your organisation free from hactic attendance registers',
    'Allow Students to see their daily attendance and sends mail to every absentees',
    'Allow teachers to see various insights about the attendance of students',
    'Support multiple department,multiple branches and multiple sections'
  ]
  const creater=[{name:'Devansh Goyal',image:devansh},{name:'Jatin Kaushik',image:jatin}]
    return (
    <>
    <Container>
      <Row >
        <Col>
          <h1 className='text-center'>Online Attendance System by Face Recognition</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <img src={photo} height='200vh' className='rounded mx-auto d-block' alt='logo'/>
        </Col>
      </Row>
      <Row >
        <Col>
          <h1 className='text-center'>Features we provide</h1>
        </Col>
      </Row>
      <Row >
        <Col>
          {features.map((feat,idx)=>{
              return <h2>{feat}</h2>
          })}
        </Col>
      </Row>
      <Row>
        <Col>
          <h1 className='text-center'>Creater of the app</h1>
        </Col>
      </Row>
      <Row>
        {creater.map(person=>(
          <Col>
            <Card>
              <CardHeader>
                <CardImg src={person.image}></CardImg>
                <h1>{person.name}</h1>
              </CardHeader>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    
    </>
  );
};

export default HomePage;
