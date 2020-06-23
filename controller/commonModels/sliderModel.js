const mongoose = require('mongoose');
const sliderSchema = new mongoose.Schema({
    caption: {
        type: String,
        require: true,
    },
    file_name: {
        type: String,
        require: true,
    },
    size: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    path: {
        type: String,
        require: true,
    },
    created_at: {
        type: String,
        require: true,
        default: new Date()
    },
    created_by: {
        type: String,
        require: true,
    },

});
let Slider = mongoose.model('slider', sliderSchema);
module.exports = Slider;