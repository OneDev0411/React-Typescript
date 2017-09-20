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
        [action.brand.id]: action.brand
      }
    case types.GET_CHILDREN_BRANDS: {
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
    }
    case types.DELETE_BRAND: {
      let stateClone = Object.assign({}, state)
      delete stateClone[action.brand.id]
      for (let i = 0; i < stateClone[action.brand.parent.id].brands.length; i++) {
        if (stateClone[action.brand.parent.id].brands[i] === action.brand.id) {
          stateClone[action.brand.parent.id].brands.splice(i, 1)
        }
      }
      return stateClone
    }
    case types.DELETE_MEMBER: {
      let stateClone = Object.assign({}, state)
      stateClone[action.role.brand].roles.forEach(role => {
        if (role.id === action.role.id) {
          for (let j = 0; j < role.members.length; j++) {
            if (role.members[j].id === action.member_id) {
              role.members.splice(j, 1)
              break
            }
          }
        }
      })
      return stateClone
    }
    case types.ADD_MEMBER: {
      let stateClone = Object.assign({}, state)
      stateClone[action.brandId].roles.forEach(role => {
        if (role.id === action.roleId) {
          role.members = action.members
        }
      })
      return stateClone
    }
    default:
      return state
  }
}
