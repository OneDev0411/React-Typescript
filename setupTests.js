import Enzyme, { ShallowWrapper, ReactWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

/**
 * searchs a "date-test" attribute
 * @returns a dom element
 */
ShallowWrapper.prototype.findByAttr = function (attr) {
  return this.find(`[data-test="${attr}"]`)
}

/**
 * query a "data-test" attribute
 * use this method if you need to query attr and class together
 * example: [data-test="foo"].active
 * @returns a dom element
 */
ShallowWrapper.prototype.queryAttr = function (attr) {
  const params = attr.split('>')

  let query = `[data-test="${params[0].trim()}"]`

  if (params.length === 2) {
    query += `${params[1].trim()}`
  }

  return this.find(query)
}

/**
 * configure Enzyme to use React16 adapter
 */
Enzyme.configure({
  adapter: new Adapter()
})
