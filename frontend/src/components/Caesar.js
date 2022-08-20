import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Form from "./Form";
import "./Caesar.css";
import Home from "@mui/icons-material/Home";

function Caesar() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(true);
  const [amount, setAmount] = useState(1);
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

  const encrypt = () => {
    var output = "";

    // Go through each character
    for (var i = 0; i < message.length; i++) {
      // Get the character we'll be appending

      // If it's a letter...
      if (message[i].match(/[a-z]/i)) {
        // Get its code
        const code = message[i].codePointAt();
        let c = "";
        // Uppercase letters
        if (code >= 65 && code <= 90) {
          c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
          output += c;
        }

        // Lowercase letters
        else if (code >= 97 && code <= 122) {
          c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
          output += c;
        }
      } else {
        output += message[i];
      }
    }

    // All done!

    return output;
  };

  const decrypt = () => {
    const str = message;
    var output = "";

    // Go through each character
    for (var i = 0; i < str.length; i++) {
      // Get the character we'll be appending
      let c = str[i];

      // If it's a letter...
      if (c.match(/[a-z]/i)) {
        // Get its code
        let code = c.codePointAt(0);

        // Uppercase letters
        if (code >= 65 && code <= 90) {
          c = String.fromCharCode(
            ((parseInt(code, 10) + (26 - amount) - 65) % 26) + 65
          );
        }

        // Lowercase letters
        else if (code >= 97 && code <= 122) {
          console.log(((parseInt(code, 10) + amount - 97) % 26) + 97);
          c = String.fromCharCode(
            ((parseInt(code, 10) + (26 - amount) - 97) % 26) + 97
          );
        }
      }
      // Append
      output += c;
    }
    return output;
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
    if (action) {
      setSecmessage(encrypt);
    } else if (!action) {
      setSecmessage(decrypt);
    }
  };
  const handleKeyChange = (event) => {
    setAmount(event.target.value % 26);

    if (action) {
      setSecmessage(encrypt);
    } else if (!action) {
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
    setAmount(1);
  };

  const goHome = () => {
    const option = document.getElementById("home");
    option.click();
  };

  return (
    <div class="caesar_container">
      <div>
        <button class="e_btn" onClick={handleClick}>
          {action ? "Encrypting..." : "Decrypting..."}
        </button>
      </div>

      <div class="caesar_main_container">
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
          id="keyselect"
          value={amount}
          onChange={handleKeyChange}
          onKeyUp={handleKeyChange}
          min="0"
          placeholder="Enter a key"
          defaultValue={1}
          type="number"
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

export default Caesar;
