const User = require("../models/user");

const signup =( req, res)=>{
  const user = new User(req.body);

  user.save((err, user)=>{
    if(err)
    {
      return res.satus(400).json({
        err:"NOT able to save user in DB"
      })
    }
    res.json({
      name:user.name,
      lastname: user.lastname,
      email: user.email,
      id:user._id
    });
  });
};

const signout = (req, res) => {
  res.json({
    message: "User Signed out",
  });
};
 
module.exports = {signup, signout}
