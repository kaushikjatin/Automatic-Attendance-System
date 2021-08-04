import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Container,
  Button,
  Form,
  Breadcrumb,
  BreadcrumbItem,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { sendOTP, verifyAccount } from "../redux/actions/authAction";
import Loader from "./Loader";
import ModalMessage from "./ModalMessage";
function VerifyEmail(props) {
  const dispatch = useDispatch();
  const role = parseInt(props.location.pathname.split("/")[2]);
  const data = props.location.state;
  const [otp, setotp] = useState(null);
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState(false);
  useEffect(() => {
    async function f() {
      const res = await dispatch(
        sendOTP({ email: data.email, role: data.role, type: "verifyEmail" })
      );
      // console.log(typeof(res))
    }
    f();
  }, []);

  //PENDING
  async function handleOTP() {
    setloading(true);
    const res = await dispatch(
      verifyAccount(
        { email: data.email, role: data.role, otp: otp },
        !data.loggedIn
      )
    );
    setloading(false);
    console.log(res);
    if (res.success == true) setsuccess(true);
    else seterror(res.err);
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Verify Account</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>Verify Email</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6>
              A mail has been sent to you containing otp.Please enter the
              following OTP down below.OTP sent is valid for 10 min only.
            </h6>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md={6} xs={12}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleOTP();
              }}
            >
              <Form.Group controlId="email">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setotp(e.target.value)}
                />
              </Form.Group>
              <Button type="submit" variant="primary">
                Verify Email
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      {loading ? (
        <ModalMessage
          isOpen={loading}
          toggle={() => setloading(!loading)}
          header="Verify Email"
          variant="none"
        >
          <Loader />
        </ModalMessage>
      ) : error != null ? (
        <ModalMessage
          isOpen={error != null}
          toggle={() => seterror(null)}
          header="Verify Email"
          variant="danger"
        >
          {error}
        </ModalMessage>
      ) : success ? (
        <ModalMessage
          isOpen={success}
          toggle={() => setsuccess(!success)}
          header="Verify Email"
          variant="success"
        >
          Account Verified. Go to <Link to="/">HOME</Link> page
        </ModalMessage>
      ) : (
        <></>
      )}
    </>
  );
}
export default VerifyEmail;
