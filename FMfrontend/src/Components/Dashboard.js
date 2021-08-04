import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Graph from "./Graph";
import { SeeAttendanceForm } from "./SeeAttendance";

const Dashboard = () => {
  const [data, setdata] = useState(undefined);
  // console.log(data)
  return (
    <>
      <SeeAttendanceForm setdata={setdata} />
      <br/>
      <Graph data={data} />
    </>
  );
};

export default Dashboard;
