const { CancellationToken } = require("mongodb");

const cartSchema = new Schema({
    items : [{
        productId : {
            ref : "Product",
            required : true
        },
        quantity : {
            type : Number,
            default :1
        },
        price : {
            type :Number,
            required : true
        },
        totalPrice : { 
            type : Number,
            required : true
        },
        status : {
            type : String,
            default : "placed"
        },
        CancellationReason : {
            type : String,
            default : "none"
        }
    }]
})

const Cart = mongoose.model("Cart",cartSchema);
module.exports = Cart;