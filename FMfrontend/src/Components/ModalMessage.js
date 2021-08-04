import React, { useState } from "react";
import {Modal,ModalHeader,ModalBody} from 'reactstrap'
import {Alert} from 'react-bootstrap'
const Message = ({ variant,toggle,isOpen, header, children }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>{header}</ModalHeader>
      <ModalBody>
        <Alert variant={variant}>{children}</Alert>
      </ModalBody>
    </Modal>
  );
};
Message.defaultProps = {
  variant: "info",

};
export default Message;
