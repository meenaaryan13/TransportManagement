const ragistration = require("../models/Employe.Ragistration.models");
const bcrypt = require("bcryptjs"); // Bcrypt require to convert normal text to hashcode
// const router = require("express").Router();
const jwt = require("jsonwebtoken"); // jwt to use user securties perpose to convert user information to decode
const JWT_SECRET =
  "QAWSEDRFTGYHUJ!UYTREEXCRVBX!DCFVGH@@%%JBBBFKFBKJCBWJCBWQDQ^^BFEWF";

class Login {
  async register(req, res) {
    const {
      UserName,
      MobileNumber,
      Email,
      Password: plainTextPassword,
      Post
      
    } = req.body;

    if (!UserName || typeof  UserName!== "string") {
      return res.json({ status: "error", error: "Invalid UserName " });
    }

    if (!MobileNumber || typeof MobileNumber !== "number") {
      return res.json({ status: "error", error: "Invalid Mobile Number" });
    }
    if (!Email || typeof Email !== "string") {
      return res.json({ status: "error", error: "Invalid Email" });
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }

    if (!Post || typeof Post !== "string") {
      return res.json({ status: "error", error: "Invalid Post" });
    }



    ragistration.findOne({MobileNumber}).then((user)=>{
      if(user)
      {
        return res.status(400).json({ MobileNumber:"Mobile Number All ready ragisterd" });
      }
    })

    ragistration.findOne({ Email }).then((user) => {
      if (user) {
         res
          .status(400)
          .json({ username:"Email All ready ragisterd" });
      }
      return
    });


    if (plainTextPassword.length < 5) {
      return res.json({
        status: "error",
        error: "password too small, Should be atleast 6 charecter",
      });
    }





    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
      const response = await ragistration.create({
        UserName,
        MobileNumber,
        Email,
        password,
        Post
      });
      // console.log("hlw");

      console.log(response);
      res.send(response);
      await response.save();
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
}

module.exports = new Login();
