import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Form from "./Form";
import Home from "@mui/icons-material/Home";
import "./Playfair.css";

export default function Playfair() {
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
    return str.length == 1 && str.match(/[a-zA-Z]/i);
  }
  const removeDuplicateChars = (string) => {
    return string
      .split("")
      .filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      })
      .join("");
  };

  const createKeyMatrix = (keyString) => {
    keyString = removeDuplicateChars(keyString) + "j";
    let keyLen = keyString.length;
    let counter = 0;
    let letterCounter = 0;
    let keyMatrix = Array.from(Array(5), () => new Array(5));
    for (let i = 0; i < keyMatrix.length; i++) {
      for (let j = 0; j < keyMatrix[0].length; j++) {
        if (counter < keyLen - 1) {
          if (!isLetter(keyString.charAt(counter))) {
            counter++;
            j--;
          } else if (keyString[counter] !== "j") {
            keyMatrix[i][j] = keyString.charAt(counter).toLowerCase();
            counter++;
          }
        } else {
          let letterToAdd = String.fromCharCode(97 + letterCounter);

          while (keyString.includes(letterToAdd)) {
            letterCounter++;
            letterToAdd = String.fromCharCode(97 + letterCounter);
          }
          letterCounter++;
          keyMatrix[i][j] = letterToAdd;
        }
      }
    }
    return keyMatrix;
  };

  const prepareMessage = (messageString) => {
    let preparedMessage = "";

    let wordCounter = 0;
    messageString.trim();
    let prevLetter = "";
    for (let i = 0; i < messageString.length; i++) {
      let letterToAdd = messageString.charAt(i);
      if (isLetter(letterToAdd)) {
        if (letterToAdd == "j") {
          letterToAdd = "i";
        }

        if (letterToAdd !== prevLetter) {
          preparedMessage += letterToAdd.toLowerCase();
          prevLetter = letterToAdd.toLowerCase();

          wordCounter++;
        } else if (letterToAdd.toLowerCase() === prevLetter.toLowerCase()) {
          preparedMessage += "x" + letterToAdd.toLowerCase();
          prevLetter = letterToAdd.toLowerCase();

          wordCounter += 2;
        }
      } else {
        if (wordCounter % 2 !== 0) {
          preparedMessage += "x";
        }
        wordCounter = 0;
        preparedMessage += " " + letterToAdd;
        prevLetter = "";
      }
    }
    if (wordCounter % 2 !== 0) {
      preparedMessage += "x";
    }
    return preparedMessage;
  };

  const prepareDecryptionMessage = (messageString) => {
    let preparedMessage = "";
    messageString = messageString.trim();

    for (let i = 0; i < messageString.length; i++) {
      const currChar = messageString.charAt(i);
      if (isLetter(currChar)) {
        preparedMessage += currChar;
      } else {
        preparedMessage += " " + currChar;
      }
    }
    return preparedMessage;
  };

  const getCharPosition = (char) => {
    let charPos = new Array(2);
    const keyMatrix = createKeyMatrix(key);
    for (let i = 0; i < keyMatrix.length; i++) {
      for (let j = 0; j < keyMatrix[0].length; j++) {
        if (keyMatrix[i][j] == char) {
          charPos[0] = i;
          charPos[1] = j;
          return charPos;
        }
      }
    }
  };
  const checkOddLenWords = (messageString) => {
    messageString = messageString.trim();
    let letterCounter = 0;

    for (let i = 0; i < messageString.length; i++) {
      const currChar = messageString.charAt(i);
      if (!isLetter(currChar)) {
        if (letterCounter % 2 != 0) {
          return false;
        } else {
          letterCounter = 0;
        }
      } else {
        letterCounter++;
      }
    }

    if (letterCounter % 2 != 0) {
      return false;
    } else {
      return true;
    }
  };

  const formPairs = () => {
    let preparedMessage = "";
    if (action) {
      preparedMessage = prepareMessage(message).trim();
    } else {
      preparedMessage = prepareDecryptionMessage(message).trim();
    }

    const preparedMessageLen = preparedMessage.length;

    const pairs = new Array(preparedMessageLen / 2.0);

    for (let i = 0, cnt = 0; i < pairs.length; i++) {
      pairs[i] = preparedMessage.substring(cnt, (cnt += 2));
    }
    return pairs;
  };

  const encrypt = () => {
    const keyMatrix = createKeyMatrix(key);
    console.log(keyMatrix);
    let pairs = formPairs();
    if (pairs == null) {
      return "";
    }
    let encryptedText = "";
    for (let i = 0; i < pairs.length; i++) {
      const ch1 = pairs[i].charAt(0);
      const ch2 = pairs[i].charAt(1);

      if (!isLetter(ch1)) {
        encryptedText += ch2;
        continue;
      }
      let ch1Pos = getCharPosition(ch1);
      let ch2Pos = getCharPosition(ch2);

      // if both the characters are in the same row move their column position 1 to the right
      if (ch1Pos[0] === ch2Pos[0]) {
        ch1Pos[1] = (ch1Pos[1] + 1) % 5;
        ch2Pos[1] = (ch2Pos[1] + 1) % 5;
      }

      // if both the characters are in the same column their column position 1 to the down
      else if (ch1Pos[1] == ch2Pos[1]) {
        ch1Pos[0] = (ch1Pos[0] + 1) % 5;
        ch2Pos[0] = (ch2Pos[0] + 1) % 5;
      }

      // if both the characters are in different rows and columns switch the column position of both characters
      else {
        let temp = ch1Pos[1];
        ch1Pos[1] = ch2Pos[1];
        ch2Pos[1] = temp;
      }

      encryptedText +=
        keyMatrix[ch1Pos[0]][ch1Pos[1]] + keyMatrix[ch2Pos[0]][ch2Pos[1]];
    }
    return encryptedText;
  };

  const decrypt = () => {
    const keyMatrix = createKeyMatrix(key);

    let pairs = formPairs();
    if (pairs == null) {
      return "";
    }
    let decryptedText = "";

    for (let i = 0; i < pairs.length; i++) {
      const ch1 = pairs[i].charAt(0);
      const ch2 = pairs[i].charAt(1);

      if (!isLetter(ch1)) {
        decryptedText += ch2;
        continue;
      }
      let ch1Pos = getCharPosition(ch1);
      let ch2Pos = getCharPosition(ch2);

      // if both the characters are in the same row move their column position 1 to the left
      if (ch1Pos[0] === ch2Pos[0]) {
        ch1Pos[1] = (ch1Pos[1] + 4) % 5;
        ch2Pos[1] = (ch2Pos[1] + 4) % 5;
      }

      // if both the characters are in the same column their column position 1 to the up
      else if (ch1Pos[1] == ch2Pos[1]) {
        ch1Pos[0] = (ch1Pos[0] + 4) % 5;
        ch2Pos[0] = (ch2Pos[0] + 4) % 5;
      }

      // if both the characters are in different rows and columns switch the column position of both characters
      else {
        let temp = ch1Pos[1];
        ch1Pos[1] = ch2Pos[1];
        ch2Pos[1] = temp;
      }

      // with the new matrix indexes concatenate the chars at their position to the encrypted text
      if (keyMatrix[ch2Pos[0]][ch2Pos[1]] == "x") {
        decryptedText += keyMatrix[ch1Pos[0]][ch1Pos[1]];
      } else if (keyMatrix[ch1Pos[0]][ch1Pos[1]] == "x") {
        decryptedText += keyMatrix[ch2Pos[0]][ch2Pos[1]];
      } else {
        decryptedText +=
          keyMatrix[ch1Pos[0]][ch1Pos[1]] + keyMatrix[ch2Pos[0]][ch2Pos[1]];
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
        setSecmessage(encrypt);
      } else if (!action) {
        if (!checkOddLenWords(message)) {
          return;
        } else {
          setSecmessage(decrypt());
        }
      }
    }
  };
  const handleKeyChange = (event) => {
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
    <div class="playfair_container">
      <div>
        <button class="e_btn" onClick={handleClick}>
          {action ? "Encrypting..." : "Decrypting..."}
        </button>
      </div>

      <div class="playfair_main_container">
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
