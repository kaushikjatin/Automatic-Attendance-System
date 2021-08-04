import React, { useState } from 'react'
import {Card, CardBody, CardHeader, CardImgOverlay } from 'reactstrap'
import {FiArrowDownCircle, FiArrowRightCircle} from 'react-icons/fi'
const Cards = ({number,subject,details,color}) => {
    const [open, setopen] = useState(false)
    return (
        <Card>
            <CardHeader className='text-white' style={{backgroundColor:color}}>
                <h1>{number}</h1>
                <p>{subject}</p>
            </CardHeader>
            <CardBody className='text-center'> {open==false?<>Details <FiArrowRightCircle onClick={()=>setopen(!open)}/></>:<>Details <FiArrowDownCircle onClick={()=>setopen(!open)}/><br/><br/>{details}</>}</CardBody>
        </Card>
    )
}

export default Cards
