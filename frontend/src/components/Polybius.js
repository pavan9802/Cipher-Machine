import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Form from "./Form";
import Home from "@mui/icons-material/Home";
import "./Polybius.css";

export default function Polybius() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(true);
  const [key, setKey] = useState("");

  const [letterArray, setLetterArray] = useState("");
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

  const removeDuplicateChars = (string) => {
    return string
      .split("")
      .filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      })
      .join("");
  };

  const createKeyMatrix = () => {
    let keyString = removeDuplicateChars(key) + "j";

    let keyLen = keyString.length;

    let counter = 0;
    let letterCounter = 0;
    let keyMatrix = Array.from(Array(5), () => new Array(5));

    for (let i = 0; i < keyMatrix.length; i++) {
      for (let j = 0; j < keyMatrix[0].length; ) {
        if (counter < keyLen - 1) {
          let letterToAdd = keyString.charAt(counter);
          //          console.log(letterToAdd);

          if (!isLetter(letterToAdd)) {
            //console.log(letterToAdd);
            counter++;
          } else if (keyString[counter] != "j") {
            //console.log(letterToAdd);
            keyMatrix[i][j] = letterToAdd.toLowerCase();
            counter++;
            j++;
          }
        } else {
          let letterToAdd = String.fromCharCode(97 + letterCounter);

          while (keyString.includes(letterToAdd)) {
            letterCounter++;
            letterToAdd = String.fromCharCode(97 + letterCounter);
          }
          letterCounter++;
          keyMatrix[i][j] = letterToAdd;
          j++;
        }
      }
    }
    return keyMatrix;
  };

  const createLetterArray = () => {
    let letterArray = new Array(26);
    const keyMatrix = createKeyMatrix();
    console.log(keyMatrix);
    for (let row = 0; row < keyMatrix.length; row++) {
      for (let col = 0; col < keyMatrix[0].length; col++) {
        const alphaPos = keyMatrix[row][col].charCodeAt() % 97;
        letterArray[alphaPos] =
          String.fromCharCode(97 + ((row + 10) % 26)) +
          String.fromCharCode(97 + ((col + 10) % 26));
      }
    }
    setLetterArray(letterArray);
  };

  const encrypt = () => {
    createLetterArray();
    let encryptedText = "";

    for (let i = 0; i < message.length; i++) {
      let currChar = message.charAt(i);
      if (isLetter(currChar)) {
        encryptedText += letterArray[currChar.charCodeAt() % 97];
      } else {
        encryptedText += currChar;
      }
    }
    return encryptedText;
  };

  const decrypt = () => {
    let keyMatrix = createKeyMatrix();

    let decryptedText = "";

    for (let i = 0; i < message.length - 1; ) {
      const c1 = message.charAt(i);
      if (isLetter(c1)) {
        const c2 = message.charAt(i + 1);
        const row = (c1.charCodeAt() - 97 + 16) % 26;
        const col = (c2.charCodeAt() - 97 + 16) % 26;
        decryptedText += keyMatrix[row][col];
        i += 2;
      } else {
        decryptedText += c1;
        i++;
      }
    }
    return decryptedText;
  };

  const handleChange = (event) => {
    if (key === "") {
      alert("Please enter a key!");
      setMessage("");
      setSecmessage("");
    } else {
      setMessage(event.target.value);
      if (action) {
        setSecmessage(encrypt());
      } else if (!action) {
        setSecmessage(decrypt());
      }
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    setAction(!action);
    setKey("");
    setMessage("");
    setSecmessage("");
  };

  const handleKeyChange = (event) => {
    setKey(event.target.value);

    if (action && key !== "") {
      encrypt();

      setSecmessage(encrypt());
    } else if (!action && key !== "") {
      setSecmessage(decrypt);
    }
  };

  const goHome = () => {
    const option = document.getElementById("home");
    option.click();
  };

  return (
    <div class="polybius_container">
      <div>
        <button class="e_btn" onClick={handleClick}>
          {action ? "Encrypting..." : "Decrypting..."}
        </button>
      </div>

      <div class="polybius_main_container">
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
          onKeyUp={handleKeyChange}
          onChange={handleKeyChange}
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
