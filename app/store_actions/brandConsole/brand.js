import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'
import { addNotification as notify } from 'reapop'

function _getBrands(brands) {
  return {
    type: types.GET_BRANDS,
    brands
  }
}

export function getBrands(user) {
  return async (dispatch) => {
    const response = await BrandConsole.getBrands(user)
    if (response && !response.error) {
      const { data } = response.body
      dispatch(_getBrands(data))
    } else {
      dispatch(notify({ message: `getBrands: ${response.error.message}`, status: response.error.statusCode }))
    }
  }
}

function _addBrand(brand) {
  return {
    type: types.ADD_BRAND,
    brand
  }
}

export function addBrand(user, brand) {
  return async (dispatch) => {
    const response = await BrandConsole.addBrand(user, brand)
    if (response) {
      const { data } = response.body
      dispatch(_addBrand(data))
    }
  }
}

function _deleteBrand(brand_id) {
  return {
    type: types.DELETE_BRAND,
    brand_id
  }
}

export function deleteBrand(brand) {
  return async (dispatch) => {
    const response = await BrandConsole.deleteBrand(brand)
    if (response &&
      response.body.status === 'success') {
      dispatch(_deleteBrand(brand.id))
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
  return async (dispatch) => {
    const response = await BrandConsole.editBrand(brand)
    if (response) {
      const { data } = response.body
      dispatch(_editBrand(data))
    }
  }
}
