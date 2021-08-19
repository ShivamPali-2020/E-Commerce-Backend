const category = require("../models/category");
const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id)=>{
    category.findById(id).exec((err, category)=>{
        if(err || !category)
        {
          return  res.status(400).json({
                error:"No such Category found in DB"
            })
        }
        req.category = category;
        next();
    });
};

exports.createCategory= (req, res)=>{
    const category = new Category(req.body);

    category.save((err, category)=>{
        if( err)
        {
            return res.status(400).json({
                error:"Not able to save the category In the DB"
            })
        }
        return res.json({category});
    })
}

exports.getCategory= (req, res)=>{
    return res.json(req.category);
}

exports.getAllCategories= (req, res)=>{
    Category.find({}).exec((err, categories)=>{
        if(err)
        {
            res.json({
                error:"No Categories found"
            })
        }
        res.json(categories)
    })
}

exports.updateCategory=(req, res)=>{
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory)=>{
        if( err)
        {
            return res.status(400).json({
                error:"Not able to update the category In the DB"
            })
        }
        return res.json({updatedCategory});
    })

}

exports.removeCategory=(req, res)=>{
    const category= req.category;
    category.remove((err, category)=>{
        if( err)
        {
            return res.status(400).json({
                error:"Not able to find the category In the DB"
            })
        }
        res.json({
            message:`Successfully deleted ${category.name}`
        })
    })
}