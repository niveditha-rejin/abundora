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

const addGenre = async(req,res)=> {
    try {
        const genre = req.body.name;
        const findGenre = await Genre.findOne({genre});
        if(!findGenre){
            const image = req.file.filename;
            const newGenre = new Genre({
                genreName : genre,
                genreImage : image,
            })
            await newGenre.save();
            res.redirect("/admin/genre");
        }
    } catch (error) {
        res.redirect("/pageerror");
    }
}

const blockGenre = async(req,res)=> {
    try {
        const id = req.query.id;
        await Genre.updateOne({_id:id},{$set:{isBlocked:true}});
        res.redirect("/admin/genre");
    } catch (error) {
        res.redirect("/pageerror");
    }
}

const unBlockGenre = async (req,res) => {
    try {
        const id = req.query.id;
        await Genre.updateOne({_id:id},{$set:{isBlocked:false}});
        res.redirect("/admin/genre");
    } catch (error) {
        res.redirect("/pageerror");
    }
}

const deleteGenre = async (req,res) => {
    try {
        const {id} = req.query;
        if(!id){
            return res.status(400).redirect("/pageerror");
        }
        await Genre.deleteOne({_id:id});
        res.redirect("/admin/genre");
    } catch (error) {
        console.error("Error deleting genre:",error);
        res.status(500).redirect("/pageerror");
    }
}

module.exports = {
    getGenrePage,
    addGenre,
    blockGenre,
    unBlockGenre,
    deleteGenre,
};