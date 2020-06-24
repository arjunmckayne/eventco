const mongoose = require('mongoose');
const sliderSchema = new mongoose.Schema({
    sliderName: {
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
    }
});
let Slider = mongoose.model('slider', sliderSchema);
module.exports = Slider;