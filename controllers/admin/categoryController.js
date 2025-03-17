const Category = require("../../models/categorySchema");
const Product = require("../../models/productSchema");


const categoryInfo = async (req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page-1)*limit;

        const categoryData = await Category.find({})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);

        const totalCategories = await Category.countDocuments();
        const totalPages = Math.ceil(totalCategories / limit);
        res.render("category", {
            cat:categoryData,
            currentPage:page,
            totalPages:totalPages,
            totalCategories:totalCategories
        })

    } catch (error) {
        console.log(error);
        res.redirect("/pageerror");
    }
}

const addCategory = async (req,res) => {
    const {name,description} = req.body;
    try {
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            return res.status(400).json({error:"Category already exists"})
        }
        const newCategory = new Category({
            name,
            description,
        })
        await newCategory.save();
        return res.json({message:"Category added successfully"})

    } catch (error) {
        return res.status(500).json({error:"Internal server error"});
    }
}


const addCategoryOffer = async(req,res)=> {
    try {
        const percentage = parseInt(req.body.percentage);
        const categoryId = req.body.categoryId;
        const category = await Category.findById(categoryId);
        if(!category){
            return res.status(404).json({status:false, message:"Category not found"})
        }
        const products = await Product.find({category:category._id});
        const hasProductOffer = products.some((product)=>product.productOffer > percentage);
        if(hasProductOffer){
            return res.json({status:false, message:"Products within this category already have product offers"});
        }
        await Category.updateOne({_id:categoryId},{$set: {categoryOffer:percentage}});
        for(const product of products){
            product.productOffer = 0;
            product.salePrice = product.regularPrice;
            await product.save();
        }
        res.json({status:true});
    } catch (error) {
        res.status(500).json({staus:false, message:"Internal server error"});
    }
};

const removeCategoryOffer = async (req, res) => {
    try {
        const { categoryId } = req.body;

       
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ status: false, message: "Category not found" });
        }

       
        if (!category.categoryOffer || category.categoryOffer === 0) {
            return res.status(400).json({ status: false, message: "No active offer for this category" });
        }

        
        await Category.findByIdAndUpdate(categoryId, { $set: { categoryOffer: 0 } });

        
        await Product.updateMany(
            { Category: category._id },
            [
                {
                    $set: {
                        salePrice: "$regularPrice",
                        productOffer: 0
                    }
                }
            ]
        );

        return res.json({ status: true, message: "Category offer removed successfully" });
    } catch (error) {
        console.error("Error removing category offer:", error);
        return res.status(500).json({ 
            status: false, 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
};

module.exports = {
    categoryInfo,
    addCategory,
    addCategoryOffer,
    removeCategoryOffer,
}