
const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
// const { sortBy } = require("lodash");


exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
      .populate("category")
      .exec((err, product) => {
        if (err) {
          return res.status(400).json({
            error: "Product not found"
          });
        }
        req.product = product;
        next();
      });
  };


exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
    let {name, description, price, category, stock} = fields;

    if(!name || !description || !price || !category || !stock)
    {
        return res.status(400).json({
            error:"Please submit all the required fields"
        })
    }
      
      let product = new Product(fields);
  
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }
  
      //save to the DB
      product.save((err, product) => {
        if (err) {
          return res.status(400).json({
            error: "Saving tshirt in DB failed"
          });
        }
        res.json(product);
      });
    });
  };
  
exports.getAProduct=(req, res)=>{
    req.product.photo= undefined;
    return res.json(req.product);
}

exports.deleteProduct=(req,res)=>{
    let product= req.product;
    product.remove((err,deletedProduct)=>{
        if(err)
        {
            res.status(400).json({
                error:"Not able to delete this product"
            })   
        }
        res.json({
            message:`Successfully deleted ${deletedProduct}`
        })
    })
}

exports.updateProduct=(req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
   
      //updation code
      let product = req.product;
      product= _.extend(product, fields);
  
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }
  
      //save to the DB
      product.save((err, product) => {
        if (err) {
          return res.status(400).json({
            error: "Updation tshirt in DB failed"
          });
        }
        res.json(product);
      });
    });
}

//Middleware
exports.photo=(req, res, next)=>{
    if(req.product.photo){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

//Product Listing
exports.getAllProduct=(req, res)=>{
    let limit = req.query.limit?parseInt(req.query.limit) : 8;
    let sortBy= req.query.sortBy? req.query.sortBy :"_id";

    Product.find()
    .populate("category")
    .select("-photo")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products)=>{
        if(err)
        {
            return res.status(400).json({
                error:"No Product Found"
            })
        }
        res.json(products)
    })
}

exports.getAllCategories=(req, res)=>{
    Product.distinct("category",{},(err, categories)=>{
        if(err)
        {
           return res.status.status(400).json({
                error:"No Category Found"
            })
        }
        res.json(categories)

    });
}

//inventory update
exports.updateStock = (req, res, next)=>{
    let myOperations = req.order.products.map( prod=>{
        return {
            UpdateOne:{
                filter:{_id: prod._id},
                update: {$inc:{stock:-prod.count , sold:+prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperations,{},(error, products)=>{
        if(err)
        {
            return res.status(400).json({
                error:"BULK Operation Failed"
            })
        }
        next();
    })
}

