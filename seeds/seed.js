const sequelize = require('../config/connection');
const { User, Item, Category} = require('../models');

const userData = require('./userData.json');
const itemData = require('./itemData.json');
const categoryData = require('./categoryData.json');

// async function that will create information for the seeds in file
const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Category.bulkCreate(categoryData, {
    individualHooks: true,
    returning: true,
  })

  for (const item of itemData) {
    const category = await Category.findOne({
      where: {
        name: item.category_name
      }
    });
    await Item.create({
      ...item,
      user_id: item.user_id,
      category_id: category.id,
    });
  }

  process.exit(0);
};

seedDatabase();
