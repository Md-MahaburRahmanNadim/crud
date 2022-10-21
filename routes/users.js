const express = require('express')
const router = express.Router()

// delete article
router.post('/delete-article', async (req, res) => {
  const articleId = req.body.articleid

  await db.none('DELETE FROM articles WHERE articleid = $1', [articleId])
  res.redirect('/article')
  // db.none('DELETE FROM articles WHERE articleid = $1', [articleId]).then(() => {
  //   res.redirect('/article')
  // })
})
// updateing specific article
router.post('/article/edit/', async (req, res) => {
  const title = req.body.title
  const description = req.body.description
  const articleId = req.body.articleid

  await db.none(
    'UPDATE articles SET title=$1,description=$2 WHERE articleid = $3',
    [title, description, articleId]
  )
  // db.none('UPDATE articles SET title=$1,description=$2 WHERE articleid = $3', [
  //   title,
  //   description,
  //   articleId,
  // ]).then(() => res.redirect('/article'))
})
router.get('/article/edit/:articleId', async (req, res) => {
  const articleId = req.params.articleId
  // we need to show the edit article title,description and also the articleId to the client (update-article) page show that which article he going to update and give the task very easy
  const article = await db.one(
    'SELECT articleid,description,title FROM articles WHERE articleid = $1',
    [articleId]
  )
  res.render('update-article', article)

  // db.one(
  //   'SELECT articleid,description,title FROM articles WHERE articleid = $1',
  //   [articleId]
  // ).then(article => {
  //   // console.log(article) the article is come in a object from
  //   res.render('update-article', article) // so we don't need to pass it like an object. It it salf is a object
  // })
})

// show a specific user articles by facting his
router.get('/article', async (req, res) => {
  const userId = req.session.user.userId
  //  this process is langthy is frist we have to login then we get this id from sesson that's why we want to fast run our test that's why we add hard coded value here
  // const userId = 13

  const article = await db.many(
    'SELECT userid,description,title,articleid FROM articles WHERE userid = $1',
    [userId]
  )
  res.render('articles', { article })

  // db.many(
  //   'SELECT userid,description,title,articleid FROM articles WHERE userid = $1',
  //   [userId]
  // )
  //   .then(article => {
  //     res.render('articles', { article })
  //   })
  //   .catch(err => console.log(err))
})
router.post('/add-article', async (req, res) => {
  const title = req.body.title
  const description = req.body.description
  const userId = req.session.user.userId
  await db.none(
    'INSERT INTO articles(title,description,userid) VALUES($1,$2,$3)',
    [title, description, userId]
  )
  res.redirect('/users/article')
  //  db.none('INSERT INTO articles(title,description,userid) VALUES($1,$2,$3)', [
  //    title,
  //    description,
  //    userId,
  //  ])
  //    .then(() => {
  //      res.redirect('/users/article')
  //    })
  //    .catch(err => res.send(err))
})

router.get('/add-article', (req, res) => {
  res.render('add-article')
})

module.exports = router
