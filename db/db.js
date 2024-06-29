const { sequelize } = require('./users')

sequelize.sync({ force: true })
  .then(() => console.log('done'))
  .catch(err => console.error('err', err))
