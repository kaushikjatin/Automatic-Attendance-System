import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Control } from "react-redux-form";
import { Label } from "reactstrap";

//Rest of code is in homepage file

const RangeSelector = ({ fields, setFields,pos }) => {
  // const [fields, setFields] = useState([]);

  function handleChange(i, position, event) {
    const values = JSON.parse(JSON.stringify(fields));
    values[pos][i][position].value = event.target.value;

    setFields(values);
  }
  function handleAdd() {
    // alert(pos)
    const values = JSON.parse(JSON.stringify(fields));
    values[pos].push({
      starting: { value: null },
      ending: { value: null },
    });
    // console.log(values)
    setFields(values);
  }
  function handleRemove(i) {
    const values = JSON.parse(JSON.stringify(fields));
    values[pos].splice(i, 1);
    setFields(values);
  }
  return (
    <>
      {/* <h1>Hello CodeSandbox</h1> */}

      <Button type="button" onClick={() => handleAdd()}>
        Add range
      </Button>
      <br/>
      {fields[pos]&&fields[pos].map((field, idx) => {
        // console.log(field)
        return (
          <span key={`${field}-${idx}`}>
            {
              <>
                <input
                  type="number"
                  placeholder="Starting Roll no."
                  value={field.starting.value || ""}
                  onChange={(e) => handleChange(idx, "starting", e)}
                  required
                />{" "}
                <input
                  type="number"
                  placeholder="Ending Roll no."
                  value={field.ending.value || ""}
                  onChange={(e) => handleChange(idx, "ending", e)}
                  required
                />{" "}
                <Button type="button" as='span' onClick={() => handleRemove(idx)}>
                  X
                </Button>
                <br/>
              </>
            }
          </span>
        );
      })}
    </>
  );
};
function getListofRollNo(fields) {
  var roll = fields.map((f) => {
    var r={};
    r.starting=parseInt(f.starting.value);
    r.ending=parseInt(f.ending.value);
    return r;
  });
  // var roll = fields;
  // console.log(roll);
  var result = [];
  for (var i = 0; i < roll.length; i++) {
    var x = Array.from(
      new Array(roll[i].ending - roll[i].starting + 1),
      (_, j) => j + roll[i].starting
    );
    result = result.concat(x);
  }
  result = result.sort((a, b) => a - b);
  //removing duplicate entries
  result = new Set(result);
  result = [...result];
  // console.log(result)
  return result;
}
export {RangeSelector,getListofRollNo};
