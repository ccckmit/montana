const fs = require('mz/fs')
const logger = require('koa-logger')
const coBody = require('co-body')
const path = require('path')
const session = require('koa-session')
const M = require('./lib/model')
const Koa = require('koa')
const Router = require('koa-router')
const json = require('koa-json')
const cors = require('@koa/cors');

const app = new Koa()
const router = new Router()

app.keys = ['#*$*#$)_)*&&^^']

const CONFIG = {
  key: 'koa:sess', // (string) cookie key (default is koa:sess)
  maxAge: 86400000, // (number) maxAge in ms (default is 1 days)
  overwrite: true, // (boolean) can overwrite or not (default true)
  httpOnly: true, // (boolean) httpOnly or not (default true)
  signed: true // (boolean) signed or not (default true)
}

app.use(logger())
app.use(session(CONFIG, app))
app.use(json())
app.use(cors()) // https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue

async function parse (ctx) {
  var json = await coBody(ctx)
  console.log('parse: json = %j', json)
  return (typeof json === 'string') ? JSON.parse(json) : json
}

async function postsList (ctx, next) {
  try {
    var r = await M.selectPosts({})
    ctx.body = r
  } catch (error) {
    console.log('postsList:error=', error)
  }
}

async function postAdd (ctx, next) {
  try {
    let data = await parse(ctx)
    console.log('data=%j', data)
    var r = await M.insertPost(data.post)
    console.log('postAdd:r=' , r)
    ctx.body = r
  } catch (error) {
    console.log('postAdd:error=', error)
  }
}

router
.get('/post/list', postsList)
.post('/post', postAdd)

/*
.post('/blog/login', login)
.post('/blog/logout', logout)
.delete('/blog/message/:id', messageDelete)
.post('/blog/message', messagePost)
.get('/blog/user/:uid', userGet)
.post('/blog/user', userPost)
*/

async function main() {
  await M.init()
  var port = 3000
  app.use(router.routes()).listen(port)
  console.log('http server started: http://localhost:' + port)
}

main()


/*
async function messageGet (ctx, next) {
  try {
    var messages = M.db
    var q = ctx.query
    console.log('message.get:q=%j', q)
    var q0 = {
      km: JSON.parse(q.km || 'null'),
      at: JSON.parse(q.at || 'null'),
      filter: JSON.parse(q.filter || '{}'),
      sort: JSON.parse(q.sort || '{}'),
      skip: JSON.parse(q.skip || 'null'),
      limit: JSON.parse(q.limit || 'null'),
    }
    console.log('message.get:q0=%j', q0)
    var r = await M.selectMessages(q0)
    ctx.body = r
    // response(ctx, 200, JSON.stringify(results, null, 2))
  } catch (error) {
    console.log('messageGet:error=', error)
  }
}

async function messageDelete (ctx, next) {
  try {
    // var r = await M.deleteMessage(ctx.query.id)
    var r = await M.deleteMessage(ctx.params.id)
    console.log('messageDelete:r=' , r)
    ctx.body = r
  } catch (error) {
    console.log('messageDelete:error=', error)
  }
}

async function messagePost (ctx, next) {
  try {
    // let message = ctx.query.message
    let post = await parse(ctx)
    console.log('post=%j', post)
    let message = post.message
    console.log('message=%j', message)
    var r = await M.insertMessage(message)
    console.log('messagePost:r=' , r)
    ctx.body = r
  } catch (error) {
    console.log('messagePost:error=', error)
  }
}

async function userGet (ctx, next) {
  try {
    var uid = ctx.params.uid
    var r = await M.getUser(uid)
    ctx.body = r
  } catch (error) {
    console.log('userGet:error=', error)
  }
}

async function userPost (ctx, next) {
  try {
    let post = await parse(ctx)
    let user = post.user
    console.log('userPost:user=%j', user)
    var r = await M.insertUser(user)
    ctx.body = r
  } catch (error) {
    console.log('userPost:error=', error)
  }
}

function isPass (ctx) {
  return typeof ctx.session.user !== 'undefined'
}

async function login (ctx, next) {
  try {
    let post = await parse(ctx)
    let pUser = post.user
    var user = await M.getUser(pUser.uid)
    if (user.password === pUser.password) {
      ctx.body = user
    }
  } catch (error) {
    console.log('login:error=', error)
  }
}

var logout = async function (ctx, next) {
  delete ctx.session.user
  ctx.body = ''
}
*/