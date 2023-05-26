const sequelize = require('../config/connection');
const { User, Item, Category} = require('../models');

const userData = require('./userData.json');
const itemData = require('./itemData.json');
const categoryData = require('./categoryData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const categories = await Category.bulkCreate(categoryData, {
    individualHooks: true,
    returning: true,
  })

  for (const item of itemData) {
    await Item.create({
      ...item,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      category_id: categories[Math.floor(Math.random() * categories.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();
