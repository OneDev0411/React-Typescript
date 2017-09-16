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
  return async (dispatch) => {
    const response = await BrandConsole.getBrands(brandId)
    if (response && !response.error) {
      const { data } = response.body
      dispatch(_getBrand(brandId, data))
    } else {
      dispatch(notify({ message: `getBrands: ${response.error.message}`, status: response.error.statusCode }))
    }
  }
}

export function getChildrenBrands(brandId) {
  return async (dispatch) => {
    const response = await BrandConsole.getChildrenBrands(brandId)
    if (response && !response.error) {
      const { data } = response.body
      dispatch(_getChildrenBrands(brandId, data))
    } else {
      dispatch(notify({ message: `getChildrenBrands: ${response.error.message}`, status: response.error.statusCode }))
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
