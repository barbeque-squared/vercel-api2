import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(Cors({
  origin: [
    //'http://localhost:3001', // uncomment for debug
    'https://karaoke-6ae33.web.app',
    'https://karaoke-6ae33.firebaseapp.com',
    'https://karaoke.barbeque.one'
  ],
  methods: ['POST', 'OPTIONS'],
}))

export default async function handler(req, res) {
  await cors(req, res)
  fetch(
    'https://www.mylittlekaraoke.com/highscores/index.php/score/retrieve?level=1',
    {method: 'POST', body: req.body}
  ).then(response => response.text())
  .then(text => {
    if (text !== 'ERROR') {
      res.statusCode = 200
      res.json({canSubmit: true})
    } else {
      res.statusCode = 200
      res.json({canSubmit: false})
    }
  }).catch(error => {
    res.statusCode = 500
    res.json({canSubmit: false})
  })
}
