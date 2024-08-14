const { sequelize } = require('./users')

sequelize.sync({ force: false })
  .then(() => console.log('done'))
  .catch(err => console.error('err', err))
