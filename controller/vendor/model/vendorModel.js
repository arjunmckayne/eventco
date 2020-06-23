const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const validator = require("validator");
const vendorSchema = new mongoose.Schema({

    
});







vendorSchema.plugin(beautifyUnique);
vendorSchema.plugin(beautifyUnique, {
    defaultMessage: "Unique Style"
});
let vendor = mongoose.model('vendor', vendorSchema);
module.exports = Vendor;