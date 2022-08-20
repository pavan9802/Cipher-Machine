import React, { useState, useEffect } from "react";

function Form(props) {
  const [mailerState, setMailerState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [nameInput, setNameInput] = useState();
  const [emailInput, setEmailInput] = useState();

  useEffect(() => {
    mailerState.message = props.message;
    setEmailInput(document.getElementById("email"));
    setNameInput(document.getElementById("name"));
  }, []);

  function handleStateChange(e) {
    setMailerState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  const submitEmail = async (e) => {
    e.preventDefault();
    mailerState.name = nameInput.value;
    mailerState.email = emailInput.value;
    mailerState.message = props.message;
    console.log({ mailerState });
    const response = await fetch(
      "https://us-central1-ciphermachinebe.cloudfunctions.net/app/send",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ mailerState }),
      }
    )
      .then((res) => res.json())
      .then(async (res) => {
        const resData = await res;
        console.log(resData);
        if (resData.status === "success") {
          console.log("Message Sent");
        } else if (resData.status === "fail") {
          alert("Message failed to send");
        }
      })
      .then(() => {
        setMailerState({
          email: "",
          name: "",
          message: "",
        });
      });
  };

  return (
    <div className="App">
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={submitEmail}
      >
        <fieldset
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <legend>Contact Form</legend>
          <input
            id="name"
            placeholder="Name"
            onChange={handleStateChange}
            name="name"
            value={mailerState.name}
          />
          <input
            id="email"
            placeholder="Email"
            onChange={handleStateChange}
            name="email"
            value={mailerState.email}
          />

          <button>Send Message</button>
        </fieldset>
      </form>
    </div>
  );
}

export default Form;
