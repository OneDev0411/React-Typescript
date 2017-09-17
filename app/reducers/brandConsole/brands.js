import types from '../../constants/brandConsole'

export default (state = {}, action) => {
  switch (action.type) {
    case types.TOGGLE_BRAND:
      return {
        ...state,
        [action.brandId]: {
          ...state[action.brandId],
          collapsed: !state[action.brandId].collapsed
        }
      }
    case types.GET_BRAND:
      return { [action.brandId]: action.brand }
    case types.EDIT_BRAND:
      return {
        ...state,
        [action.brandId]: action.brand
      }
    case types.GET_CHILDREN_BRANDS:
      let arrayToObject = {}
      action.brands.forEach(brand =>
        arrayToObject[brand.id] = brand
      )
      let childrenBrands = state[action.brandId].brands || []
      childrenBrands = childrenBrands.concat(action.brands.map(brand => brand.id))
      return {
        ...state,
        [action.brandId]: {
          ...state[action.brandId],
          brands: childrenBrands
        },
        ...arrayToObject
      }
    default:
      return state
  }
}
