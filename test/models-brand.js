// test/models-brand.js
import { expect } from 'chai'
import Brand from '../app/models/Brand'
import config from '../config/private'
/* Branding
==================== */
describe('Testing Branding model', () => {
  // Signin
  it('Branding.getBySubdomain should return successful', function(done) {
    const params = {
      'claystapp'
    }
    Brand.getBySubdomain(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })  
})