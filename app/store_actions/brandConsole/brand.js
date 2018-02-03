import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'
import { addNotification as notify } from 'reapop'

export function toggleBrand(brandId) {
  return {
    type: types.TOGGLE_BRAND,
    brandId
  }
}

function _getBrand(brandId, brand) {
  return {
    type: types.GET_BRAND,
    brand,
    brandId
  }
}

function _getChildrenBrands(brandId, brands) {
  return {
    type: types.GET_CHILDREN_BRANDS,
    brands,
    brandId
  }
}

export function getBrand(brandId) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.getBrands(brandId)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_getBrand(brandId, data))
    } else {
      dispatch(
        notify({
          message: `getBrands: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

export function getChildrenBrands(brandId) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.getChildrenBrands(brandId)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_getChildrenBrands(brandId, data))
    } else {
      dispatch(
        notify({
          message: `getChildrenBrands: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

export function addBrand(brand) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.addBrand(brand)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body
      const responseAddRole = await BrandConsole.addRole(data.id, {
        role: 'Owner',
        acl: ['Deals', 'BackOffice', 'Admin']
      })

      if (responseAddRole) {
        const role = responseAddRole.body.data

        dispatch(
          _getChildrenBrands(brand.parent, [
            {
              ...data,
              roles: [role]
            }
          ])
        )
      }
    } else {
      dispatch(
        notify({
          message: `addBrand: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

function _deleteBrand(brand) {
  return {
    type: types.DELETE_BRAND,
    brand
  }
}

export function deleteBrand(brand) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.deleteBrand(brand.id)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error && response.body.status === 'success') {
      dispatch(_deleteBrand(brand))
    } else {
      dispatch(
        notify({
          message: `deleteBrand: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

function _editBrand(brand) {
  return {
    type: types.EDIT_BRAND,
    brand
  }
}

export function editBrand(brand) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.editBrand(brand)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_editBrand(data))
    } else {
      dispatch(
        notify({
          message: `addBrand: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}
