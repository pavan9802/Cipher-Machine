import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Form from "./Form";
import Home from "@mui/icons-material/Home";
import "./Affine.css";

export default function Affine() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(true);
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const [secmessage, setSecmessage] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  useEffect(() => {
    createKey();
  }, []);

  function isLetter(str) {
    return str.length === 1 && str.match(/[a-zA-Z]/i);
  }

  const createKey = () => {
    let key = "";
    for (let i = 122; i >= 97; i--) {
      key += String.fromCharCode(i);
    }
    setKey(key);
  };

  const encrypt = () => {
    let encryptedText = "";
    for (let i = 0; i < message.length; i++) {
      const charToAdd = message.charAt(i).toLowerCase();
      if (isLetter(charToAdd)) {
        const keyPosition = charToAdd.charCodeAt() % 97;
        encryptedText += key.charAt(keyPosition);
      } else {
        encryptedText += charToAdd;
      }
    }
    return encryptedText;
  };

  const decrypt = () => {
    let decryptedText = "";
    for (let i = 0; i < message.length; i++) {
      const charToAdd = message.charAt(i).toLowerCase();
      if (isLetter(charToAdd)) {
        const keyPosition = charToAdd.charCodeAt() % 97;
        decryptedText += key.charAt(keyPosition);
      } else {
        decryptedText += charToAdd;
      }
    }
    return decryptedText;
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
    if (action) {
      setSecmessage(encrypt);
    } else if (!action) {
      setSecmessage(decrypt());
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    setAction(!action);
    setMessage("");
    setSecmessage("");
  };

  const goHome = () => {
    const option = document.getElementById("home");
    option.click();
  };

  return (
    <div class="affine_container">
      <div>
        <button class="e_btn" onClick={handleClick}>
          {action ? "Encrypting..." : "Decrypting..."}
        </button>
      </div>

      <div class="affine_main_container">
        <textarea
          onKeyUp={handleChange}
          value={message}
          onChange={handleChange}
          id="inputtext"
          class="text"
          placeholder={action ? "Enter Plaintext" : "Enter Ciphertext"}
          rows="15"
          cols="35"
        ></textarea>

        <textarea
          id="outputtext"
          value={secmessage}
          rows="15"
          class="text"
          cols="35"
          readonly="true"
        ></textarea>
      </div>

      <div class="container_btn">
        <button class="submit_btn" onClick={handleOpen}>
          Send Message
        </button>
        <IconButton
          onClick={goHome}
          class="icn_btn"
          aria-label="delete"
          size="large"
        >
          <Home fontSize="inherit" />
          <Link id="home" to="/"></Link>
        </IconButton>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Form message={secmessage} />
        </Box>
      </Modal>
    </div>
  );
}
