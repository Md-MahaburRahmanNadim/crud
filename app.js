const express = require('express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const path = require('path')
const session = require('express-session')
const userRouter = require('./routes/users')
const othersRouter = require('./routes/index')
const cheakAuthrizition = require('./utils/authrizition')
// const CONNECTION_STRING = 'postgresql://postgres:nadim@localhost:5432/newsdb'
const CONNECTION_STRING =
  'postgres://nhqikcwajaqqae:3e34010cf170795547a7395bac127553defd015a1f2bcc5a5c78deff58c741ef@ec2-34-247-72-29.eu-west-1.compute.amazonaws.com:5432/dal3b8e9ldq37v'
const PORT = process.env.PORT || 8080
db = pgp(CONNECTION_STRING)
const mustacheExpress = require('mustache-express')
const app = express()
app.use(
  session({
    secret: 'sdlfdfdjfdfjd j d fjdfj df ',
    resave: false,
    saveUninitialized: false,
  })
)
app.use(bodyParser.urlencoded({ extended: false }))
const VIEWS_PATH = path.join(__dirname + '/views')
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')

const SALTorROUNDS = 20
// static file registration
app.use((req, res, next) => {
  // here we put the authenticated property in locals object. This locals object is avalable in all the template pages
  res.locals.authenticated = req.session.user == null ? false : true
  next()
})
app.use('/css', express.static('css'))
app.use(othersRouter)
app.use('/users', cheakAuthrizition, userRouter)
app.listen(PORT, () => {
  console.log('Our app is listen in port 3000')
})
