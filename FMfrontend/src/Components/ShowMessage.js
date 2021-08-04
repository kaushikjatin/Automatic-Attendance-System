import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import ModalMessage from './ModalMessage'
const ShowMessage = ({type,header,data}) => {
    const [modal, setmodal] = useState(true)
    useEffect(() => {
        setmodal(true)
    }, [type,data])
    return (
        <>
      {type==='loading' ? (
        <ModalMessage
          isOpen={modal}
          toggle={() => setmodal(!modal)}
          header={header}
          variant="none"
        >
          <Loader />
        </ModalMessage>
      ) : type==='error' ? (
        <ModalMessage
        isOpen={modal}
        toggle={() => setmodal(!modal)}
        header={header}
          variant="danger"
        >
          {data}
        </ModalMessage>
      ) : type==='success' ? (
        <ModalMessage
        isOpen={modal}
        toggle={() => setmodal(!modal)}
        header={header}
          variant="success"
        >
          {data}
        </ModalMessage>
      ) : (
        <></>
      )}
      </>
    )
}

export default ShowMessage
