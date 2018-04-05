const assert = require('assert')
const M = require('../lib/model')
const aUser = require('./someUsers.json')[0]
const eq = assert.equal, neq = assert.notEqual, ok = assert.ok

describe('Model', () => {
  before(async () => { await M.init() })
  after(async () => { await M.close() })
  it('selectMessages(km=10)', async () => {
    let messages = await M.selectMessages({km: 5, at: aUser.at})
    eq(messages.length, 5)
  })
})
