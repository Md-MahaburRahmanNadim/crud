const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const SALTorROUNDS = 10
// logout functionality
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        next(error)
      } else {
        res.redirect('/login')
      }
    })
  }
})

// home page functonality for unknow user
router.get('/', async (req, res) => {
  //   db.many('SELECT articleid,description,title FROM articles ').then(article => {
  //     // console.log(article)
  //     res.render('index', { article })
  //   })
  // })
  const article = await db.many(
    'SELECT articleid,description,title FROM articles '
  )
  res.render('index', { article })
})

router.post('/login', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if (req.session) {
    const user = await db.oneOrNone(
      'SELECT username,password,userid from users where username = $1',
      [username]
    )
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          if (req.session) {
            req.session.user = {
              userId: user.userid,
              userName: user.username,
              userPassword: user.password,
            }
            req.session.message =
              'Thanks for login. Please create your own article'
            res.redirect('/users/add-article')
          } else {
            res.redirect('/register', {
              message: `Please login to create your article in our news portal`,
            })
          }
        } else {
          req.session.message = `Please login to create your article in our news portal`
          res.redirect('/register')
        }
      })
    } else {
      req.session.message = `Please login to create your article in our news portal`
      res.redirect('/register')
    }
  }
})

// db.oneOrNone(
//   'SELECT username,password,userid from users where username = $1',
//   [username]
// ).then(user => {
//   if (user) {
//     bcrypt.compare(password, user.password, (error, result) => {
//       if (result) {
//         if (req.session) {
//           req.session.user = {
//             userId: user.userid,
//             userName: user.username,
//             userPassword: user.password,
//           }
//           res.redirect('/users/add-article')
//         }
//       } else {
//         res.redirect('/register')
//       }
//     })
//   } else {
//     res.redirect('/register')
//   }
// })

router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/register', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  // db.oneOrNone(
  //   'SELECT userid,username,password FROM users WHERE username = $1',
  //   [username]
  // ).then(user => {
  //   if (user) {
  //     res.redirect('/login')
  //     // res.render('register', { message: username })
  //   } else {
  //     bcrypt.hash(username, SALTorROUNDS, (error, hash) => {
  //       db.none('INSERT INTO users(username,password) VALUES($1,$2)', [
  //         username,
  //         hash,
  //       ]).then(() => {
  //         res.redirect('/login')
  //       })
  //     })
  //   }
  // })
  const user = await db.oneOrNone(
    'SELECT userid,username,password FROM users WHERE username = $1',
    [username]
  )
  if (user) {
    res.redirect('/login', {
      message: `This use alredy exist please login ${user.username}`,
    })
  } else {
    bcrypt.hash(username, SALTorROUNDS, async (error, hash) => {
      await db.none('INSERT INTO users(username,password) VALUES($1,$2)', [
        username,
        hash,
      ])
      res.redirect('/login', { message: `Walcome our news portal plase login` })
    })
  }
})
router.get('/register', (req, res) => {
  res.render('register')
})
router.get('/hello', (req, res) => {
  res.send('hello')
})

module.exports = router
