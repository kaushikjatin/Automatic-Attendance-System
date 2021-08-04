import React, { useEffect, useState } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { MenuItem } from 'react-pro-sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { dropDown, viewClass } from '../redux/actions/classAction'
import Loader from './Loader'

const ShowAllClass = ({particularClass, setparticularClass,onClick}) => {
    const [classes, setclasses] = useState([])
    const [loading, setloading] = useState(true)
    const [error,seterror]=useState(null)
    const {user} = useSelector(state => state.auth)
    // const [particularClass, setparticularClass] = useState(null)
    const dispatch = useDispatch()
    useEffect(() => {
        async function f(){var param={
            branchCode:user.branch
        }
        var response=await dispatch(dropDown(param))
        setloading(false)
        if(response.success===false)
            seterror('Unable to fetch data')
        else{
            setclasses(response.class)
        }
        }
        f()
    }, [dispatch,user])
    async function renderEditClass(cl){
        var Class=await dispatch(viewClass({branchCode:user.branch,yearOfStart:cl}))
        // console.log(Class)
        if(Class.error)
            console.error(Class.error)
        else
            setparticularClass(Class.class)
            
        
    }
    return (
        <>
            {loading?
            <MenuItem>
            Loading...
            </MenuItem>:error?<MenuItem>{error}</MenuItem>:
            <>
                {classes.map((cl,idx)=>{
                    return(
                        <MenuItem key={idx}  onClick={()=>{renderEditClass(cl);onClick()}}>
                            {cl}
                        </MenuItem>
                    )
                })}
            {/* <p>{JSON.stringify(particularClass)}</p> */}
            </>
            }
        </>
    )
}

export default ShowAllClass
