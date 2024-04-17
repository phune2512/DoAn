const mongoose = require('mongoose');

var side_itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    soluong: Number,
    
    isDeleted:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })
module.exports = new mongoose.model('side_item', side_itemSchema)