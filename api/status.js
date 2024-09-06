module.exports = function ({ router, ...deps }) {
  router.get('/status', function (req, res) {
    res.sendStatus(200)
  })

  router.get('/nihao', function (req, res) {
    res.json({ test: 'nihao' })
  })

  return router
}
