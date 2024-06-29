const { Users } = require('../db/users')

module.exports = function ({ router, ...deps }) {
  router.get('/users', async function (req, res) {
    const { region } = req.query

    let selector = {}

    if (region) {
      selector = { where: { region } }
    }

    selector.attributes = { exclude: ['uid'] }

    const users = await Users.findAll(selector)

    res.json(users)
  })

  router.post('/users', async function (req, res) {
    const { uid, nickname, region, score } = req.body

    const result = await Users.findOrCreate({ where: { uid }, defaults: { uid, nickname, region, score } })

    res.json(result)
  })

  router.post('/score', async function (req, res) {
    const { uid, score } = req.body

    await Users.update({ score }, { where: { uid } })

    res.json({ status: 200 })
  })

  return router
}
