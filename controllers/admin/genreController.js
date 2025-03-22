const Genre = require("../../models/genreSchema");
const product = require("../../models/productSchema");

const getGenrePage = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page-1)*limit;
        const genreData = await Genre.find({}).sort({createdAt:-1}).skip(skip).limit(limit);
        const totalGenres = await Genre.countDocuments();
        const totalPages = Math.ceil(totalGenres/limit);
        const reverseGenre = genreData.reverse();
        res.render("genre",{
            data:reverseGenre,
            currentPage:page,
            totalPages:totalPages,
            totalGenres:totalGenres,
        })
    } catch (error) {
        res.redirect("/pageerror");
    }
}

module.exports = {
    getGenrePage,
}