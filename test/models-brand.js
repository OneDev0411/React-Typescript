// test/models-brand.js
import { expect } from 'chai'
import Brand from '../app/models/Brand'
import config from '../config/private'
/* Branding
==================== */
describe('Testing Brand model', () => {
  // Signin
  it('Branding.getByHostname should return successful', function(done) {
    const params = {
      hostname: 'claystapp.rechat.com'
    }
    Brand.getByHostname(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })  
})