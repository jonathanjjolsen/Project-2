const router = require('express').Router();
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');

router.use('/users', userRoutes);
router.use('/items', itemRoutes);

module.exports = router;

// api/index.js brings together all the api routes in one section. That makes it more clean to be exported in the controllers/index.js