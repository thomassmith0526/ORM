const router = require('express').Router();
const { Tag, Product, ProductTag,} = require('../../models')
// const Tag = require('../../models/Tag');
// const Product = require('../../models/Product');
// const ProductTag = require('../../models/ProductTag')

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [Product],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  } 
   // find all tags
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [Product],
    });
    if (!tagData) {
      res.status(404).json({message: 'No Tag with that ID!'})
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.status(200).json(tagData)
  } catch (err) {
    res.status(400).json(err)
  }
  // create a new tag
});

router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if(!tagData[0]) {
      res.status(400).json({message: 'No Tag with this ID!'});
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
  // update a tag's name by its `id` value
});

router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if(!tagData) {
      res.status(404).json({ message: " No Tag with that ID!"});
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
  // delete on tag by its `id` value
});

module.exports = router;
