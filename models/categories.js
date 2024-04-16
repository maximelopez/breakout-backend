const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: String,
    description: String,
})

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;