import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addSubject, deleteSubject, editSubject, viewSubject } from '../redux/actions/subject';
import Loader from './Loader';
import ModalMessage from "./ModalMessage";
const AddSubject = ({Subject}) => {
    const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth); //for getting branch Code
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState(false);
  const [showMessage,setShowMessage]=useState('addSubject')
  const [code, setcode] = useState('')
  const [name, setname] = useState('')
//   useEffect(() => {
//     var Section=[],RollNo=[],Attendance=[];
//     if(Subject){
//     Subject.section.forEach((sec,idx)=>{
//       var range=rangeFromRollNo(sec.students)
//       Section.push({name:{value:sec.name},students:{pos:idx},attendance:{pos:idx}})
//       RollNo.push(range)
//       Attendance.push(sec.attendance)
//     })
//     setsection(Section)
//     setrollNo(RollNo)
//     setattendance(Attendance)
//     setyearOfStart(Subject.yearOfStart)
//     setShowMessage('editSubject')
//   }
//   }, [Subject])
  const handleSubmit = async (e) => {
    //embedding rollno and attending inside section
    
    const Subject1 = {
        name:name,
        code:code
    };
    const msg = { seterror, setloading, setsuccess };
    // seterrorMessage("");
    msg.setloading(true);

     const response = Subject==null?await dispatch(addSubject(Subject1)):await dispatch(editSubject(Subject1))
   
    console.log(response)
    msg.setloading(false);
    if (response.success === true){
        if(response.error)
            msg.setsuccess(response.error)
        else
            msg.setsuccess(true)
    }
    else msg.seterror(response.err);
    Subject==null?setShowMessage('addSubject'):
    setShowMessage('editSubject')
    // console.log(error)
    // console.log(success)
  };
  async function removeSubject(e){
    const Subject1={code:code,name:name}
    // console.log(Subject1)
    const msg = { seterror, setloading, setsuccess };
    // seterrorMessage("");
    msg.setloading(true);

    //DISPATCH THING HERE
    // console.log(val)
     const response = await dispatch(deleteSubject(Subject1))
   
    console.log(response)
    msg.setloading(false);
    if (response.success === true){
        if(response.error)
            msg.setsuccess(response.error)
        else
            msg.setsuccess(true)
    }
    else msg.seterror(response.err);
    setShowMessage('deleteSubject')
    // console.log(error)
    // console.log(success)
  }
  async function getSubjectName(){
      if(Subject==null){
          return;
      }
      else{
          const data=await dispatch(viewSubject({code:code}))
          console.log(data)
          if(data.subject.name)
            setname(data.subject.name|| '')
          else{
          setname(data.subject.name|| '')
            seterror('no such subject found')
        }
          return;
      }
  }
  const message={
    addSubject:<>Subject added successfully.</>,
    editSubject:<>Subject edited</>,
    deleteSubject:<>Subject deleted.</>
  }
//   console.log(Subject)
//   console.log(Subject==null)
  return (
    <>
            {Subject==null?<h1>Add Subject</h1>:<h1>Edit Subject</h1>}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit()
              }}
            >
              <Form.Group controlId="Subject code">
                <Form.Label>Subject code</Form.Label>
                <Form.Control
                  type="text"
                  value={code}
                  onChange={(e) => setcode(e.target.value.toUpperCase())}
                  onBlur={()=>getSubjectName()}
                  required
                />
              </Form.Group>
              <Form.Group controlId="Name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Button type="submit">{Subject==null?<h3>Add Subject</h3>:<h3>Edit Subject</h3>}</Button>
              {Subject==null?<></>:<Button onClick={()=>removeSubject()}><h3>Remove Subject</h3></Button>}
            </Form>
      {loading ? (
        <ModalMessage
          isOpen={loading}
          toggle={() => setloading(!loading)}
          header="Subject"
          variant="none"
        >
          <Loader />
        </ModalMessage>
      ) : error != null ? (
        <ModalMessage
          isOpen={error != null}
          toggle={() => seterror(null)}
          header="Subject"
          variant="danger"
        >
          {error}
        </ModalMessage>
      ) : success ? (
        <>
          <ModalMessage
            isOpen={success}
            toggle={() => setsuccess(!success)}
            header="Subject"
            variant="success"
          >
            {message[showMessage]}
            <br />
            {success}
          </ModalMessage>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default AddSubject
