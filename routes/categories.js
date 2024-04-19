const express = require("express");
const router = express.Router();

const Category = require("../models/categories");

router.post("/", (req, res) => {
  if (req.body.name && req.body.description) {
    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    newCategory.save().then((newCategory) => {
      res.json({ result: true, category: newCategory });
    });
  } else {
    res.json({ result: false, error: "Missing or empty fields" });
  }
});

// recherche de catégorie par son ID
router.get("/:category", (req, res) => {
  let category = req.params.category;
  Category.findOne({ _id: category }).then((category) => {
    if (category) {
      //   let name = data.name;
      //   let name = data.name;
      //   let description = data.description;
      // affichage catégorie sous forme de name et description
      //   res.json({ result: true, name, description });
      let name = category.name;
      res.json({ result: true, name });
    } else {
      res.json({ result: false, error: "Catégorie non trouvée" });
    }
  });
});

module.exports = router;
