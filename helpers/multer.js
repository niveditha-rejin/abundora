const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../books/img/genre"));
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+File.originalname);
    }
})

module.exports = storage;
