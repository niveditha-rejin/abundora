const mongoose = require("mongoose");
const {Schema} = mongoose;

const genreSchema = new Schema({
    genreName : {
        type : String,
        required : true
    },
    genreImage : {
        type : [String],
        required : true
    },
    isBlocked : { 
        type : Boolean,
        default : false
    },
    createdAt : { 
        type : Date,
        default : Date.now
    }
})

const Genre = mongoose.model("Genre",genreSchema);
module.exports = Genre;
