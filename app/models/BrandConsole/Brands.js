import Fetch from '../../services/fetch/index'

export async function getBrands(brandId) {
  try {
    return await new Fetch().get(
      `/brands/${brandId}?associations[]=brand.roles&associations[]=brand_role.members`
    )
  } catch (error) {
    return { error }
  }
}

export async function getChildrenBrands(brandId) {
  try {
    return await new Fetch().get(
      `/brands/${brandId}/children?associations[]=brand.roles&associations[]=brand_role.members`
    )
  } catch (error) {
    return { error }
  }
}

export async function addBrand(brand) {
  try {
    return await new Fetch()
      .post('/brands?associations[]=brand.roles')
      .send(brand)
  } catch (error) {
    return { error }
  }
}

export async function editBrand(brand) {
  try {
    return await new Fetch().put(`/brands/${brand.id}`).send(brand)
  } catch (error) {
    return { error }
  }
}

export async function deleteBrand(brandId) {
  try {
    return await new Fetch().delete(`/brands/${brandId}`)
  } catch (error) {
    return { error }
  }
}

export default {
  getBrands,
  getChildrenBrands,
  addBrand,
  editBrand,
  deleteBrand
}
