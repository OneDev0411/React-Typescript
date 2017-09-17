import Fetch from '../../services/fetch/index'

const Brands = {}

Brands.getBrands = async function (brandId) {
  try {
    return await new Fetch()
      .get(`/brands/${brandId}?associations[]=brand.roles&associations[]=brand_role.members`)
  } catch (error) {
    return { error }
  }
}

Brands.getChildrenBrands = async function (brandId) {
  try {
    return await new Fetch()
      .get(`/brands/${brandId}/children?associations[]=brand.roles&associations[]=brand_role.members`)
  } catch (error) {
    return { error }
  }
}

Brands.addBrand = async function (brand) {
  try {
    return await new Fetch()
      .post('/brands/')
      .send(brand)
  } catch (error) {
    return { error }
  }
}

Brands.editBrand = async function (brand) {
  try {
    return await new Fetch()
      .put(`/brands/${brand.brand}/brands/${brand.id}`)
      .send(brand)
  } catch (e) {
    console.log(e)
  }
}

Brands.deleteBrand = async function (brand) {
  try {
    return await new Fetch()
      .delete(`/brands/${brand.brand}/brands/${brand.id}`)
  } catch (e) {
    console.log(e)
  }
}
export default Brands
