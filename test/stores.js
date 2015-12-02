// test/stores.js
import { expect } from 'chai'
import AppStore from '../app/stores/AppStore'

describe('Testing stores', () => {
  it('AppStore.data.ready defaults to false', () => {
    expect(AppStore.data.ready).to.not.be.true
  });
})