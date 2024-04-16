const express = require('express');
const router = express.Router();

const Category = require('../models/categories');

router.post('/', (req, res) => {
    if (req.body.name && req.body.description) {

        const newCategory = new Category({
            name: req.body.name,
            description: req.body.description,
        });

        newCategory.save().then(newCategory => {
            res.json({ result: true, category: newCategory });
        })

    } else {
        res.json({ result: false, error: 'Missing or empty fields' });
    }
});

module.exports = router;