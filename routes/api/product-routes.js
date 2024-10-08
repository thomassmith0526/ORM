const router = require('express').Router();
const { Category, Product, Tag, ProductTag,} = require('../../models')
// const Category = require('../../models/Category');
// const Product = require('../../models/Product');
// const Tag = require('../../models/Tag');
// const ProductTag = require('../../models/ProductTag');

// The `/api/products` endpoint

// get all products
router.get('/', async(req, res) => {
  try {
    const prodData = await Product.findAll({
      include: [ Category,
         {model: Tag}],
    });
    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err)
  }  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const prodData = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag }],
    });
    if (!prodData) {
      res.status(404).json({ message: 'No Product with that ID!'})
      return;
    }
    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err)
  }

});

// create new product
router.post('/',  async (req, res) => {
  try {
    const prodData = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      tagIds: req.body.tagIds,

    });
    res.status(200).json(prodData);
  } catch (err) {
    res.status(400).json(err)
  }

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const prodData = await Product.destroy({
      where:{
        id: req.params.id,
      },
    });
    if (!prodData) {
      res.status(404).json({ message: 'No Product with that ID!'})
      return;
    }
    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err)
  }
  // delete one product by its `id` value
});

module.exports = router;
