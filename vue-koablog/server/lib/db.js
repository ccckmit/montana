// const U = require('./util')
// const G = require('./geo')
const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const messages = 'messages'
const users = 'users'
// const misavodb = 'misavodb'

const S = module.exports = {}

S.dbOpen = async function (url='mongodb://localhost:27017', dbName='koablog') {
  S.url = url
  S.dbName = dbName
  S.client = await MongoClient.connect(url)
  S.db = await S.client.db(dbName)
  return S.db
}

S.dbCreate = async function (url) {
  await S.dbOpen()
  await S.db.collection(messages).ensureIndex({ domain: 1, uid: 1, 'at.x': 1, 'at.y': 1, 'price.hour': 1 })
  await S.db.collection(messages).createIndex({ '$**': 'text'}) // createIndex({ content: 'text'})
  await S.db.collection(users).ensureIndex({ uid: 1, email: 1, displayName: 1 })
  return S.db
}

S.dbClose = async function () {
  return S.client.close()
}

S.insert = async function (tableName, record) {
  // console.log('insert:M.db=', M.db)
  const table = S.db.collection(tableName)
  if (record.time == null) record.time = new Date()
  let result = await table.insert(record)
  // console.log('misavodb:insert : result=', result)
  // return Object.values(result.insertedIds)
  return result
}

S.select = async function (tableName, q={}) {
  let filter = q.filter || {}
  let sort = q.sort || {}
  let skip = q.skip || 0
  let limit = q.limit || 9999
  const table = S.db.collection(tableName)
  let result = await table.find(filter).sort(sort).skip(skip).limit(limit)
  // let result = await table.find(query)
  return result.toArray()
}

S.delete = async function (tableName, filter) {
  const table = S.db.collection(tableName)
  return await table.remove(filter)
  //  console.log('results = ', results)
  // let result = await table.find(query)
  //  return (results.result.ok === 1)
}

S.deleteById = async function (tableName, id) {
  let oId = new mongodb.ObjectID(id);
  const table = S.db.collection(tableName)
  let results = await table.remove({_id: oId})
  console.log('results = ', results)
  // let result = await table.find(query)
  return (results.result.ok === 1)
}

S.clear = async function (tableName) {
  const table = S.db.collection(tableName)
  return table.remove({})
}

S.dbClear = async function () {
  await S.clear(messages)
  await S.clear(users)
}

/*
S.messages.insert = async function (records) {
  return M.insert(messages, records)
}

S.messages.select = async function (query) {
  return M.find(messages, query)
}

S.filterNear = function (at, dx, dy) {
  return {'at.x': {$gte: at.x - dx, $lte: at.x + dx}, 'at.y': {$gte: at.y - dy, $lte: at.y + dy}}
}

S.filterNearInKm = function (at, km) {
  var dx, dy
  dx = dy = G.km2dist(km)
  return {'at.x': {$gte: at.x - dx, $lte: at.x + dx}, 'at.y': {$gte: at.y - dy, $lte: at.y + dy}}
}

S.users.insert = async function (records) {
  return M.insert(users, records)
}

S.users.find = async function (query) {
  return M.find(users, query)
}
*/

/*
S.insert = async function (tableName, records) {
  // console.log('insert:M.db=', M.db)
  const table = S.db.collection(tableName)
  for (record of records) {
    if (record.time == null) record.time = new Date()
  }
  let result = await table.insertMany(records)
  // console.log('result=', result)
  return Object.values(result.insertedIds)
}
*/
