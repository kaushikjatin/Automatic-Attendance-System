import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { viewClass } from "../redux/actions/classAction";
import Cards from "./Cards";
import BarChart from "./linegraph/linegraph.component";
import Loader from "./Loader";
import { Chart } from "react-google-charts";
import { Calendar } from "react-calendar";
import { Table } from "reactstrap";
import "react-calendar/dist/Calendar.css";
import Graph from "./Graph";
const SeeClass = ({ Class, isMobile }) => {
  const dispatch = useDispatch();
  const [attendance, setattendance] = useState({});
  const [date, setdate] = useState(new Date());
  const [absentees, setabsentees] = useState();
  const [present, setpresent] = useState("Loading");
  console.log(Class)
  useEffect(() => {
    (async function () {
      const res = await dispatch(viewClass(Class));
        // console.log(res);
      if (res.success === true) {
        setattendance(res.class);
        var pre = res.class.attendance.filter((at) => {
          var x = new Date(at.date);
          var y = new Date(date);
          return x.getFullYear() === y.getFullYear()
            ? x.getMonth() === y.getMonth()
              ? x.getDate() === y.getDate()
                ? true
                : false
              : false
            : false;
        });
        if (pre.length === 0) {
          setpresent(`No class on ${date.toDateString()}`);
          setabsentees(`No class on ${date.toDateString()}`);
        } else {
          setpresent(pre[0]);
          var abs = allStudent.filter((stu) => {
            var a = pre[0].presentStudent.filter(
              (pres) => pres.rollNo === stu.rollNo
            );
            return a.length === 0;
          });
          // console.log(abs)
          setabsentees(abs);
        }
      } else {
        console.error(res);
        setattendance({});
      }
    })();
    // console.log('fl')
  }, [dispatch, date, Class]);
  var allStudent = attendance.totalStudent ? attendance.totalStudent : [];
  return (
    <>
     <Graph data={attendance}/>
      <br />
      <Row className="justify-content-center">
        {/* <Col xs={12} md={3}>
          <Cards
            number={2}
            subject="Below 70% attendance"
            details={"Yet to be passed on"}
            color="green"
          />
        </Col> */}
        <Col xs={12} md={2}>
          <Cards
            number={
              absentees && typeof absentees !== "string" ? absentees.length : 0
            }
            subject="Today's Absentees"
            details={
              typeof absentees === "string" ? (
                <h5>{absentees}</h5>
              ) : (
                <Table striped size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Roll No.</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absentees ? (
                      absentees.map((st, idx) => (
                        <tr>
                          <td>{idx + 1}</td>
                          <td>{st.rollNo}</td>
                          <td>{st.name}</td>
                        </tr>
                      ))
                    ) : (
                      <></>
                    )}
                  </tbody>
                </Table>
              )
            }
            color="red"
          />
        </Col>
        <Col xs={12} md={2}>
          <Cards
            number={present.presentStudent ? present.presentStudent.length : 0}
            subject="Today's Present"
            details={
              typeof present === "string" ? (
                <h5>{present}</h5>
              ) : (
                <Table striped size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Roll No.</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {present.presentStudent ? (
                      present.presentStudent.map((st, idx) => (
                        <tr>
                          <td>{idx + 1}</td>
                          <td>{st.rollNo}</td>
                          <td>{st.name}</td>
                        </tr>
                      ))
                    ) : (
                      <></>
                    )}
                  </tbody>
                </Table>
              )
            }
            color="orange"
          />
        </Col>
        <Col xs={12} md={2}>
          <Cards
            number={allStudent.length}
            subject="Today's Students"
            details={
              <Table striped size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Roll No.</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {allStudent.map((student, idx) => (
                    <tr>
                      <td>{idx + 1}</td>
                      <td>{student.rollNo}</td>
                      <td>{student.name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            }
            color="darkviolet"
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={9} md={3} className="col-md-offset-3 mx-auto">
          <Calendar
            onChange={(val) => {
              var pre = attendance.attendance.filter((at) => {
                var x = new Date(at.date);
                var y = new Date(val);
                return x.getFullYear() === y.getFullYear()
                  ? x.getMonth() === y.getMonth()
                    ? x.getDate() === y.getDate()
                      ? true
                      : false
                    : false
                  : false;
              });
              setdate(val);

              if (pre.length === 0) {
                setpresent(`No class on ${date.toDateString()}`);
                setabsentees(`No class on ${date.toDateString()}`);
              } else {
                setpresent(pre[0]);
                var abs = allStudent.filter((stu) => {
                  var a = pre[0].presentStudent.filter(
                    (pres) => pres.rollNo === stu.rollNo
                  );
                  return a.length === 0;
                });
                // console.log(abs)
                setabsentees(abs);
              }
            }}
            value={date}
          />
        </Col>
      </Row>
    </>
  );
};

export default SeeClass;
