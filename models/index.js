const User = require('./User');
const Item = require('./Item');
const Category = require('./Category');

User.hasMany(Item, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Item.belongsTo(User, {
  foreignKey: 'user_id'
});

Category.hasMany(Item, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
});

Item.belongsTo(Category, {
  foreignKey: 'category_id'
})

module.exports = { User, Item, Category };

// This specific page brings in all other js under /models into one place. this will then be exported and called upon with one place instead of 3. This will also introduce foreign keys that are intertwinded between categories. 