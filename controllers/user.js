const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById=(req, res, next, id)=>{
 User.findById(id).exec((err, user)=>{
     if(err || !user)
     {
         return res.status.status(400).json({
             error:"User not found"
         })
     }
     req.profile = user;
     next();

 });
};

exports.getUser=(req, res) =>{
    req.profile.salt= undefined;
    req.profile.encry_password= undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},  //find the user by Id
        {$set: req.body},      //what you really want to update
        {new:true, useFindAndModify:false}, //compulsory field
        (err, user)=>{
            if(err)
            {
                return res.status(400).json({
                    error:"You are not Authorised user to update the user"
                })
            }
            user.salt= undefined;
            user.encry_password= undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            return res.json(user);
        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
      .populate("user", "_id name")
      .exec((err, order) => {
        if (err) {
          return res.status(400).json({
            error: "No Order in this account"
          });
        }
        return res.json(order);
      });
  };

exports.pushOrderInPurchaseList=(req, res, next)=>{
    let purchases=[];
    req.body.order.products.forEach(product=>{
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.body.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    //Store in DB
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new: true}, // send me the information updated one not old one
        (err, purchases)=>{
            if(err){
                return res.status(400).json({
                    error: "Unable to save Purchased List"
                })
            }
            next();
        }    
    )

  
}