const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
app.use(cors());

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: `${process.env.EMAIL}`,
    pass: `${process.env.PASS}`,
    clientId: `${process.env.OAUTH_CLIENTID}`,
    clientSecret: `${process.env.OAUTH_CLIENT_SECRET}`,
    refreshToken: `${process.env.OAUTH_REFRESH_TOKEN}`,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

app.post("/send", function (req, res) {
  let mailOptions = {
    from: `"${process.env.EMAIL}"`,
    to: `${req.body.mailerState.email}`,
    subject: `Message from: ${req.body.mailerState.name}`,
    text: `${req.body.mailerState.message}`,
  };

  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      console.log("== Message Sent ==");
      res.json({
        status: "success",
      });
    }
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
