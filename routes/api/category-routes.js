const router = require('express').Router();
// const { Category, Product } = require('../../models');
const Category = require('../../models/Category');
const Product = require('../../models/Product');


router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{model: Product}],
    });
    res.status(200).json(categoryData);
  } catch (err){
    res.status(500).json(err);
  }

});

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{model: Product}],
    });
    if (!categoryData) {
      res.status(404).json({message: 'No Category with that id!'})
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.post('/', async (req, res) => {
  try{
    const categoryData = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err)
  }
  // create a new category
});

router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData[0]) {
      res.status(400).json({message: 'No category with this ID!'});
      return;
    }
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err)
  }
  // update a category by its `id` value
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No Category with that ID!'});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err)
  }
  // delete a category by its `id` value
});

module.exports = router;
