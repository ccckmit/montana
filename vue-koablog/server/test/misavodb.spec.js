const assert = require('assert')
const S = require('../lib/misavodb')
const someUsers = require('./someUsers.json')
const someMessages = require('./someMessages.json')
const ok = assert.ok
const aUser = someUsers[0]

describe('MisavoDB', () => {
  before(async () => {
    let db = await S.dbCreate()
    await S.dbClear()
    ok(db != null)
  })
  after(async () => {
    // await S.clear()
    await S.dbClose()
  })
  it('users.insert(someUsers)', async () => {
    for (user of someUsers) {
      let r = await S.insert('users', user)
      // console.log('users.insert():r=', r)
      ok(r.result.ok === 1)
    }
    // eq(ids.length, someUsers.length)
  })
  it('messages.insert(someMessages)', async () => {
    for (message of someMessages) {
      let r = await S.insert('messages', message)
      // console.log('messages.insert():r=', r)
      ok(r.result.ok === 1)
      // eq(ids.length, someMessages.length)
    }
  })
  it('messages.select()', async () => {
    // let result = await S.messages.find({})
    // let records = result.toArray()
    let records = await S.select('messages', {})
    // console.log('records=', records)
    ok(records.length === someMessages.length)
  })
})

/*
it('messages.find(domain:"child care")', async () => {
  let result = await S.messages.find({domain: 'child care'})
  ok(result.toArray().length > 0)
})
it('messages.find(24.45 < at.x < 24.46)', async () => {
  let result = await S.messages.find({'at.x': {$gte: 24.45, $lte: 24.46 } })
  ok(result.toArray().length > 0)
})
it('messages.findNearInKm(user1, 5km)', async () => {
  let result = await S.messages.find(S.filterNearInKm(aUser.at, 5))
  ok(result.toArray().length > 0)
  console.log('result=', result.toArray())
})
*/
/*
async function userSaveCheck(user) {
  expect.assertions(1)
  db.setUser(user)
  let obj = await db.getUser(user.uid)
  user.time = obj.time
  return expect(obj).toEqual(user)
}

async function addMessages(messages) {
  let midList = []
  for (let message of messages) {
    midList.push(await db.addMessage(message))
  }
  return midList
}
*/
/*
it('db.setup(urspace):link', async () => {
  let link = {linkto: 'user:' + urspace.uid}
  await saveCheck('link', 'urspace', link)
})
*/
/*
it('db.setup(ccckmit):link', async () => {
  let link = {linkto: 'user:' + ccckmit.uid}
  await saveCheck('link', 'ccckmit', link)
})
*/
