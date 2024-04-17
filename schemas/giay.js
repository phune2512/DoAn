const mongoose = require('mongoose');

var giaySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    size: Number,
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'author'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })
module.exports = new mongoose.model('giay', giaySchema)