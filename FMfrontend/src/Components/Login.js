import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/actions/authAction";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import Message from "./Message";
const Login = ({ location, history }) => {
  const dispatch = useDispatch();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState(0);
  const loginHandler = async (e) => {
    e.preventDefault();
    console.log(role)
    const result = await dispatch(userLogin(email, password, role));
  };
  const auth = useSelector((state) => state.auth);
  const { loading, error, user } = auth;
  const redirect = location.search ? location.search.split("redirec=")[1] : "/";
  useEffect(() => {
    if (user) history.push(redirect);
  }, [user, redirect, history]);
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6} xs={12}>
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
          <h1>User Login</h1>
          <Form onSubmit={loginHandler}>
            <Form.Group controlId="user">
              <Form.Label>User</Form.Label>
              <Form.Control as="select" onChange={e=>setrole(e.target.value)}>
                <option value={0}>Student</option>
                <option value={1}>Teacher</option>
                <option value={2}>Department</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Login
            </Button>
          </Form>
          {/* <Row className='py-3'>
                <Col>
                    New User? <Link to={`/register`}>Register</Link>
                </Col>
            </Row> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
