exports.signup =( req, res)=>{
  console.log("REQ BODY", req.body)
    res.json({
        message:"Signup Works"
    });
};

exports.signout = (req, res) => {
  res.json({
    message: "User Signed out",
  });
};
