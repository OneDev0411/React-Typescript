import * as actionsType from '../../constants/user'
import getBrands from '../../models/user/get-brands'

export default function getUserBrands(user = {}) {
  return async dispatch => {
    const brands = await getBrands(user)

    dispatch({
      type: actionsType.SET_USER_BRANDS,
      brands
    })
  }
}
