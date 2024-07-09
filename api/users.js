const { Sequelize, DataTypes } = require('sequelize')
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
    const result = await sequelize.query(`
      WITH top_users AS (
        SELECT *
        FROM (
          SELECT
            region,
            nickname,
            icon,
            score,
            ROW_NUMBER() OVER (PARTITION BY region ORDER BY score DESC) as rank
          FROM users
        ) ranked
        WHERE rank <= 20
      ),
      region_stats AS (
        SELECT
          region,
          COUNT(*) as userCount,
          SUM(score) as totalScore
        FROM users
        GROUP BY region
      )
      SELECT
        rs.region,
        rs.userCount,
        rs.totalScore,
        JSON_GROUP_ARRAY(
          JSON_OBJECT(
            'nickname', tu.nickname,
            'icon', tu.icon,
            'score', tu.score
          )
        ) as users
      FROM region_stats rs
      LEFT JOIN top_users tu ON rs.region = tu.region
      GROUP BY rs.region
      ORDER BY rs.totalScore DESC
    `, {
      type: Sequelize.QueryTypes.SELECT
    })

    const formattedResult = result.map(row => ({
      ...row,
      users: JSON.parse(row.users).sort((a, b) => b.score - a.score)
    }))

    res.json(formattedResult)
  })

  return router
}
