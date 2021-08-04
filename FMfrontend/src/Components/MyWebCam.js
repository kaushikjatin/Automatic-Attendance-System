import React, { createRef, useState } from "react";
import { Component } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import Webcam from "react-webcam";
class MyWebcam extends Component {
  constructor() {
    super();
    this.state = {
      imgSrc: [],
      selectedImg: [],
      styleImg: [],
    };
    this.selectimg = this.selectimg.bind(this);
    this.capture = this.capture.bind(this);
    this.ShowImages = this.ShowImages.bind(this);
    this.webcamRef = createRef();
  }
  componentDidMount() {
  }
  selectimg(i) {
    var temp = [...this.state.selectedImg];
    var index = temp.indexOf(i);
    if (index > -1) {
      temp.splice(index, 1);
      this.setState({ selectedImg: temp });
      this.props.handleImage(this.state.imgSrc.filter((img,idx)=>temp.indexOf(idx)!==-1));
    } else {
      this.setState({ selectedImg: [...temp, i] });
      this.props.handleImage(this.state.imgSrc.filter((img,idx)=>[...temp, i].indexOf(idx)!==-1));
  }
    var tempStyle = [...this.state.styleImg];
    if (this.state.styleImg[i].border === "none")
      tempStyle[i] = { ...tempStyle[i], border: "5px solid green" };
    else tempStyle[i] = { ...tempStyle[i], border: "none" };
    this.setState({ styleImg: tempStyle });
  }
  capture() {
    const imageSrc = this.webcamRef.current.getScreenshot({
      width: 512,
      height: 512,
    }); 

    // (imgSrc.push(imageSrc));
    this.setState({
      imgSrc: [...this.state.imgSrc, imageSrc],
      styleImg: [...this.state.styleImg, { border: "none" }],
    });
    // setImgSrc()
    // setstyleImg()
  }
  ShowImages() {
    // console.log(this.state);
    return (
      <>
        {this.state.imgSrc.map((image, i) => {
          return (
            <Col md={4} sm={2} className='py-4'>
            <Image
              onClick={() => {
                this.selectimg(i);
              }}
              src={image}
              style={{ ...this.state.styleImg[i],width:'100%' }}
            /></Col>
          );
        })}
      </>
    );
  }
  render() {
    return (
      <>
        <Webcam
          width='100%'
          height={295}
          audio={false}
          ref={this.webcamRef}
          screenshotFormat="image/jpeg"
        />
        <br />
        <Button onClick={this.capture}>Capture photo</Button>
        <Row><this.ShowImages/></Row>
        
      </>
    );
  }
}
export default MyWebcam;
