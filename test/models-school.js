// test/models-user.js
import { expect } from 'chai'
import School from '../app/models/School'
import config from '../config/private'

/* School
==================== */
describe('Testing School model', () => {
  // Search School
  it('School.search should return successful', function(done) {
    const params = {
      q: 'dallas'
    }
    School.search(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})