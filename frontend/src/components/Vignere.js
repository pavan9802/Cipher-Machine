import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Form from "./Form";
import Home from "@mui/icons-material/Home";
import "./Vignere.css";

export default function Vignere() {
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

  function isLetter(str) {
    return str.length === 1 && str.match(/[a-zA-Z]/i);
  }
  function isUpperCase(character) {
    if (character === character.toUpperCase()) {
      return true;
    }
    if (character === character.toLowerCase()) {
      return false;
    }
  }
  const encrypt = () => {
    let output = "";
    let messageLen = message.length;
    let encryptKey = "";
    let i = 0;
    while (encryptKey.length != messageLen) {
      encryptKey += key[i];
      i++;
      i = i % key.length;
    }

    for (let i = 0, j = 0; i < message.length; i++) {
      const c = message[i].codePointAt();

      let newLetter = message[i];

      if (isLetter(message[i])) {
        if (isUpperCase(message[i])) {
          const keyc = encryptKey[j].toUpperCase().codePointAt();
          newLetter = String.fromCharCode(((c - 65 + keyc - 65) % 26) + 65);
          j++;

          // A: 65
        } else {
          const keyc = encryptKey[j].toLowerCase().codePointAt();
          newLetter = String.fromCharCode(((c - 97 + keyc - 97) % 26) + 97);
          j++; // a: 97
        }
      }
      output += newLetter;
    }
    return output;
  };

  const decrypt = () => {
    let output = "";
    let messageLen = message.length;
    let encryptKey = "";
    let i = 0;
    while (encryptKey.length != messageLen) {
      encryptKey += key[i];
      i++;
      i = i % key.length;
    }

    for (let i = 0, j = 0; i < message.length; i++) {
      const c = message[i].codePointAt();

      let newLetter = message[i];

      if (isLetter(message[i])) {
        if (isUpperCase(message[i])) {
          const keyc = encryptKey[j].toUpperCase().codePointAt();
          newLetter = String.fromCharCode(((c - keyc + 26) % 26) + 65);
          j++;

          // A: 65
        } else {
          const keyc = encryptKey[j].toLowerCase().codePointAt();
          newLetter = String.fromCharCode(((c - keyc + 26) % 26) + 97);
          j++; // a: 97
        }
      }

      output += newLetter;
    }
    return output;
  };

  const handleChange = (event) => {
    if (key === "") {
      alert("Please enter a key!");
      setMessage("");
      setSecmessage("");
    } else {
      setMessage(event.target.value);
      if (action) {
        setSecmessage(encrypt);
      } else if (!action) {
        setSecmessage(decrypt());
      }
    }
  };
  const handleKeyChange = (event) => {
    console.log(key);

    setKey(event.target.value);
    if (action && key !== "") {
      setSecmessage(encrypt);
    } else if (!action && key !== "") {
      setSecmessage(decrypt);
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
    setKey("");
  };

  const goHome = () => {
    const option = document.getElementById("home");
    option.click();
  };

  return (
    <div class="vignere_container">
      <div>
        <button class="e_btn" onClick={handleClick}>
          {action ? "Encrypting..." : "Decrypting..."}
        </button>
      </div>

      <div class="vignere_main_container">
        <textarea
          onKeyUp={handleChange}
          value={message}
          onChange={handleChange}
          id="inputtext"
          class="text"
          placeholder={action ? "Enter Plaintext" : "Enter Ciphertext"}
          rows="10"
          cols="30"
        ></textarea>

        <input
          class="keyselect"
          id="keyseslect"
          value={key}
          onChange={handleKeyChange}
          onKeyUp={handleKeyChange}
          placeholder="Enter a key"
          type="text"
        ></input>

        <textarea
          id="outputtext"
          value={secmessage}
          rows="10"
          class="text"
          cols="30"
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
