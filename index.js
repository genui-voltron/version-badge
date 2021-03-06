const app = require('express')()
const axios = require('axios')
const { sendSVG, handleError, cacheControl } = require('./utils')

app.get('/', (req, res) => {
  res.end('https://github.com/egoist/version-badge')
})

app.get('/npm/:name.svg', cacheControl, handleError(async (req, res) => {
  const { name } = req.params
  const { tag = 'latest' } = req.query
  const { data } = await axios.get(`https://registry.npmjs.org/${name}`)
  sendSVG(res, data['dist-tags'][tag])
}))

app.get('/gh/:owner/:repo.svg', cacheControl, handleError(async (req, res) => {
  const { owner, repo } = req.params
  const { file = 'package.json', branch = 'master', field = 'version' } = req.query
  const { data } = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`)
  sendSVG(res, data[field])
}))

app.listen(3300)
console.log('> Open http://localhost:3300')
