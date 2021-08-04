import React from "react";
import { Col, Row } from "react-bootstrap";
import Chart from "react-google-charts";
import Loader from "./Loader";
const Graph = ({ data }) => {
  var graphData =
    data && data.attendance
      ? data.attendance.map((at) => {
          return [at.date.toString(), at.presentStudent.length];
        })
      : [];
  return (
    <>
      {data ? (
        <>
          <Row>
            <Col md={6} className="col-md-offset-3 mx-auto">
              <h1 className='text-white'>Graph</h1>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="col-md-offset-3 mx-auto">
              <Chart
                width="100%"
                height={"400px"}
                chartType="LineChart"
                loader={<Loader />}
                data={[["x", "attendance"], ...graphData]}
                options={{
                  hAxis: {
                    title: "Date",
                  },
                  vAxis: {
                    title: "Attendance",
                  },
                }}
              />
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Graph;
