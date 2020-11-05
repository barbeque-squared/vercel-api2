import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(Cors({
  origin: [
    'http://localhost:3000', // uncomment for debug
    'https://karaoke-6ae33.web.app',
    'https://karaoke-6ae33.firebaseapp.com',
    'https://karaoke.barbeque.one'
  ],
  methods: ['POST', 'OPTIONS'],
}))

export default async function handler(req, res) {
  await cors(req, res)
  fetch(
    'https://www.mylittlekaraoke.com/highscores/index.php/score/submit',
    {method: 'POST', headers: {'Content-Type': 'application/json'}, body: req.body}
  ).then(response => response.text())
  .then(text => {
    res.statusCode = 200
    switch (text) {
      case '0': res.json({error: true, message: 'connection failed'}); break
      case '2': res.json({error: true, message: 'login failed'}); break
      case '3': res.json({error: false}); break
      case '4': res.json({error: true, message: 'score error'}); break
      case '5': res.json({error: true, message: 'duplicate score'}); break
      case '7': res.json({error: true, message: 'song error'}); break
      default: res.json({error: true, message: 'unknown response'})
    }
  }).catch(error => {
    res.statusCode = 500
    res.json({error: true, message: 'unknown error'})
  })
}
