import Fetch from 'services/fetch'

const defaultAssociations = ['brand.roles', 'brand_role.users']

export async function deprecatedGetBrands(brandId) {
  try {
    return await new Fetch().get(
      // eslint-disable-next-line max-len
      `/brands/${brandId}?associations[]=brand.roles&associations[]=brand_role.members`
    )
  } catch (error) {
    return { error }
  }
}

export async function getBrands(
  brandId: string,
  fetchChildren: boolean = true,
  customeAssociations: string[] = defaultAssociations
): Promise<ApiResponseBody<IBrand>> {
  const associations = [...customeAssociations]

  if (fetchChildren) {
    associations.push('brand.children')
  }

  return (
    await new Fetch().get(`/brands/${brandId}`).query({
      associations
    })
  ).body
}

export async function getChildrenBrands(brandId) {
  try {
    return await new Fetch().get(
      // eslint-disable-next-line max-len
      `/brands/${brandId}/children?associations[]=brand.roles&associations[]=brand_role.users`
    )
  } catch (error) {
    return { error }
  }
}

interface BrandRole extends Pick<IBrandRole, 'acl' | 'role'> {
  members: { user: UUID }[]
}

export async function addBrand(
  team: Partial<IBrand>,
  parentId: string | null,
  roles?: BrandRole[]
): Promise<ApiResponseBody<IBrand>> {
  const payload: IBrandInput = {
    name: team.name,
    brand_type: team.brand_type,
    parent: parentId,
    roles
  }

  return (
    await new Fetch()
      .post('/brands')
      .query({ associations: [...defaultAssociations, 'brand.children'] })
      .send(payload)
  ).body
}

export async function editBrand(
  brand: Partial<IBrand>
): Promise<ApiResponseBody<IBrand>> {
  if (!brand.id) {
    throw new Error('team id is empty')
  }

  return (
    await new Fetch()
      .put(`/brands/${brand.id}`)
      .query({ associations: defaultAssociations })
      .send(brand)
  ).body
}

export async function deleteBrand(brandId: string) {
  return new Fetch().delete(`/brands/${brandId}`)
}

export default {
  deprecatedGetBrands,
  getBrands,
  getChildrenBrands,
  addBrand,
  editBrand,
  deleteBrand
}
