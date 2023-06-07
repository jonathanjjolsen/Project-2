const router = require('express').Router();
const {Op} = require("sequelize")
const { Item, User, Category } = require('../models');
const withAuth = require('../utils/auth');


router.get('/item/:id', withAuth, async (req, res) => {
  try {
    const itemData = await Item.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const item = itemData.get({ plain: true });

    res.render('item', {
      ...item,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Item }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  const errorMessage = req.flash('errorMessage');
  res.render('signup', { errorMessage });
});

router.post('/signup', async (req, res) => {
  try {
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    
    if (existingUser) {
      req.flash('errorMessage', 'The user/email already exists');
      res.redirect('/signup');
    } else if (req.body.password.length < 8) {   // Check if password length is less than 8
      req.flash('errorMessage', 'Password should be at least 8 characters');
      res.redirect('/signup');
    } else {
      const userData = await User.create(req.body);
   
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        res.redirect('/login');
      });
    }
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      req.flash('errorMessage', 'Validation error occurred. Please ensure that all fields meet requirements.');
    } else {
      console.log(err);
      res.status(500).json(err);
    }
    res.redirect('/signup');
  }
});
router.get('/', async (req, res) => {
  try {
    const { category } = req.query; // Retrieve the value from the search bar
    // Get all items for sale and JOIN with user and category data
    if(category){

      itemData = await Category.findAll({
        where: {
          name: { [Op.like]: `%${category}%` }
        },
        include: [
          {
            model: Item,
          },
        ],
      });
    }else {
      itemData = await Category.findAll({
        include: [
          {
            model: Item,
          },
        ],
      });

    }
    
    // Serialize data so the template can read it
    const data = itemData.map((item) => item.get({ plain: true }));
    // Pass serialized data and session flag into template
    
    let items = [];
    data.forEach(category => items.push(...category.items));
    console.log(items)
    res.render('homepage', {
      items,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});
module.exports = router;
