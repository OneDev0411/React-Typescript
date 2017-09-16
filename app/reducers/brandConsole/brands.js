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
    case types.GET_CHILDREN_BRANDS:
      let arrayToObject = {}
      action.brands.forEach(brand =>
        arrayToObject[brand.id] = brand
      )
      return {
        ...state,
        [action.brandId]: {
          ...state[action.brandId],
          brands: action.brands.map(brand => brand.id)
        },
        ...arrayToObject
      }
    default:
      return state
  }
}
