import { BRAND_SUCCESS, BRAND_FAILURE } from '../../constants/brand'

const brand = (state = null, action) => {
  switch (action.type) {
    case BRAND_SUCCESS:
      return action.brand
    case BRAND_FAILURE:
      return null
    default:
      return state
  }
}

export default brand
