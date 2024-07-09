const { sequelize, Users } = require('../db/users')

module.exports = function ({ router, ...deps }) {
  router.get('/users', async function (req, res) {
    const { region } = req.query

    let selector = {}

    if (region) {
      selector = { where: { region } }
    }

    selector.attributes = { exclude: ['uid'] }
    selector.order = [['score', 'DESC']]
    selector.limit = 20

    const users = await Users.findAll(selector)

    res.json(users)
  })

  router.post('/users', async function (req, res) {
    const { uid, nickname, region, score, icon } = req.body

    const result = await Users.findOrCreate({ where: { uid }, defaults: { uid, nickname, region, score, icon } })

    res.json(result)
  })

  router.post('/score', async function (req, res) {
    const { uid, score } = req.body

    await Users.update({ score }, { where: { uid } })

    res.json({ status: 200 })
  })

  router.get('/top', async function (req, res) {
    const selector = {
      attributes: [
        'region',
        [sequelize.fn('COUNT', sequelize.col('uid')), 'userCount'],
        [sequelize.fn('SUM', sequelize.col('score')), 'totalScore']
      ],
      group: ['region'],
      order: [[sequelize.literal('totalScore'), 'DESC']]
    }

    const users = await Users.findAll(selector)

    res.json(users)
  })

  return router
}
