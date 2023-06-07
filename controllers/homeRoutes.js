const router = require('express').Router();
const { Item, User, Category } = require('../models');
const withAuth = require('../utils/auth');

// Homepage selection. this renders the homepage handlebars.
router.get('/', async (req, res) => {
  try {
    // Get all items for sale and JOIN with user data
    const itemData = await Item.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Category,
          attributes: ['name'],
        }
      ],
    });

    // Serialize data so the template can read it
    const items = itemData.map((item) => item.get({ plain: true }));
    // Pass serialized data and session flag into template
    res.render('homepage', { 
      items, 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get route that uses the withAuth custom middleware. This specific route will get the specific item attached to the ID. However, if the user is NOT logeed in, it will direct them to the log in page. 
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

// Get route that also uses the withAuth custom middleware. This route takes the user to their profile. However, if the user is not logged it it will direct them to log in since when you are not logged in, there is no profile. 
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

// Get route that sends the user to the login page. However, if the client is already logged in it will just send the user to their profile. 
router.get('/login', (req, res) => {

  // this if statement is what will determine if the client is logged in or not. 
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// Get route that sends the user to the signup page. If the client is already signed in, then it will just take them to their profile. 
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  const errorMessage = req.flash('errorMessage');
  res.render('signup', { errorMessage });
});

// This route is a POST route for sign up. Once the client has filled in the necessary information, the server will create the profile with the users informaiton. 
router.post('/signup', async (req, res) => {
  try {
    // const to determine if a user already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    
    // if statement that takes the const created and matches it to the attempted signup informaiton. If there is a user/email already there, then it will alert the user that this already exists. 
    if (existingUser) {
      req.flash('errorMessage', 'The user/email already exists');
      res.redirect('/signup');

      // This forces the user to select a password that is 8 or greater characters in length
    } else if (req.body.password.length < 8) {  
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
    const itemData = await Item.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Category,
          where: { name: category }, // Filter by category name
          attributes: ['name'],
        },
      ],
    });
    // Serialize data so the template can read it
    const items = itemData.map((item) => item.get({ plain: true }));
    // Pass serialized data and session flag into template
    res.render('homepage', {
      items,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
