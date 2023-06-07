const router = require('express').Router();
const { Op } = require("sequelize")
const { Item, Category } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    let categories
    if (category) {
      categories = await Category.findAll({
        where: {
          name: { [Op.like]: `%${category}%` }
        },
        include: [{
          model: Item
        }]
      });
    } else {
      categories = await Category.findAll({
      });

    }

    res.status(200).json(categories.map(item => item.get({ plain: true })));
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const newItem = await Item.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newItem);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const itemData = await Item.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!itemData) {
      res.status(404).json({ message: 'No Item found with this id!' });
      return;
    }

    res.status(200).json(itemData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
