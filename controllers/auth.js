const User = require("../models/user");
const { validationResult } = require("express-validator");
const user = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const user = new User(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "USER email does not exist",
      });
    }
    if (!user.autheticate(password)) {
      return res.status(400).json({
        err: "USER email and password not match",
      });
    }

    //create a token
    var token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to Front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signed out",
  });
};

//protected routes
exports.isSignedin= expressJwt({
  secret: process.env.SECRET,
  userProperty:"auth"
});

//custom middleware
exports.isAuthenticated=(req,res,next)=>{

  let checker = req.profile && req.auth && req.profile._id==req.auth._id;


  if(!checker)
  {
    res.status(400).json({
      error:"ACCESS DENIED!"

    });
  }
  next();
};


exports.isAdmin = (req, res,next)=>{
  if(req.profile.role==0)
  {
    res.status(400).json({
      error:"You are not ADMIN, ACCESS DENIED"
    });
  }
  next();
};
