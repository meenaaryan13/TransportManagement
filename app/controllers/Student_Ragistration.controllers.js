const ragistration = require("../models/Student_Ragistration.models");
const OtpVerification = require("../models/OtpVerification.models");
const bcrypt = require("bcryptjs"); // Bcrypt require to convert normal text to hashcode
// const router = require("express").Router();
const jwt = require("jsonwebtoken"); // jwt to use user securties perpose to convert user information to decode
const JWT_SECRET =
  "QAWSEDRFTGYHUJ!UYTREEXCRVBX!DCFVGH@@%%JBBBFKFBKJCBWJCBWQDQ^^BFEWF";

const nodemailer = require("nodemailer");
//Genrate mail otp
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email,
    pass: process.env.pass,
  },
});

class Login {
  async register(req, res) {
    const {
      FirstName,
      LastName,
      MobileNumber,
      FatherName,
      Email,
      password: plainTextPassword,
      Branch,
      Year,
      Track,
    } = req.body;

    if (!FirstName || typeof FirstName !== "string") {
      return res.json({ status: "error", error: "Invalid FirstName" });
    }

    if (!LastName || typeof LastName !== "string") {
      return res.json({ status: "error", error: "Invalid LastName" });
    }
    if (!MobileNumber || typeof MobileNumber !== "number") {
      return res.json({ status: "error", error: "Invalid Mobile Number" });
    }
    if (!FatherName || typeof FatherName !== "string") {
      return res.json({ status: "error", error: "Invalid FatherName" });
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }

    ragistration.findOne({ MobileNumber }).then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ MobileNumber: "Mobile Number All ready ragisterd" });
      }
    });

    ragistration.findOne({ Email }).then((user) => {
      if (user) {
        res.status(400).json({ username: "Email All ready ragisterd" });
      }
      return;
    });

    if (plainTextPassword.length < 5) {
      return res.json({
        status: "error",
        error: "password too small, Should be atleast 6 charecter",
      });
    }

    if (!Branch || typeof Branch !== "string") {
      return res.json({ status: "error", error: "Invalid Branch" });
    }
    if (!Year || typeof Year !== "string") {
      return res.json({ status: "error", error: "Invalid Year" });
    }
    if (!Track || typeof Track !== "string") {
      return res.json({ status: "error", error: "Invalid Track" });
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
      const response = await ragistration.create({
        FirstName,
        LastName,
        MobileNumber,
        FatherName,
        Email,
        password,
        Branch,
        Year,
        Track,
      });
      // console.log("hlw");

      console.log(response);
      res.send(response);
      await response
        .save()
        .then((result) => {
          otpverifhy(result, res);
        })
        .catch((err) => {
          res.json({
            status: "verfhey",
            message: " some errors",
          });
        });
      res.status(200);
      //  res.json({message:'ok'});
      res.end(response);
      //  return res.redirect();
    } catch (error) {
      if (error.code === 11000) {
        //duplicate key
        // console.log(error);
        return res
          .json({
            msg: "not rgt",
            status: "error",
            error: "User already Ragistered",
          })
          .status(401);

        // console.log(res.json());
      }
      throw error;
    }
    // res.json({status:'ok'})
  }

  async login(req, res) {
    const { Email, password } = req.body;
    const user = await ragistration.findOne({ Email }).lean();

    if (!user) {
      return res.json({ status: "error", error: "Invalid username/password" });
    }

    if (await bcrypt.compare(password, user.password)) {
      //compare dbpassword and login password
      const token = jwt.sign(
        {
          id: user._id,
          Email: user.Email,
        },
        JWT_SECRET
      );
      return res.json({ status: "ok", data: token, msg: "Login successfull" });
    }

    res.json({ status: "error", error: "Invalid username" });
  }

  async changepass(req, res) {
    const { token, newpassword: plainTextPassword } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const _id = user.id;
      const password = await bcrypt.hash(plainTextPassword, 10);

      await ragistration.updateOne(
        { _id },
        {
          $set: { password },
        }
      );
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: "" });
    }
  }

  async otpverifhy({ _id, Email }, res) {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      var mailOptions = {
        from: process.env.Email, // sender address
        to: `${Email}`, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world ?", // plaintext body
        html: `Please verifhy this otp <b>${otp} </b>and fheel`, // html body
      };

      const newOtpverification = new OtpVerification.create({
        userId: _id,
        otp: otp,
        createAt: Date.now(),
        expiresAt: Date.now + 10000,
      });

      await newOtpverification.save();

      await transporter.sendMail(mailOptions);

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.log("it has error ", error);
        } else {
          console.log("Email has sent ");
        }
      });

      res.json({
        status: "Pending",
        message: "Verification otp email sent",
        data: {
          userId: _id,
          Email,
        },
      });
    } catch (error) {
      res.status(501).json(error);
    }
  }
}

module.exports = new Login();
