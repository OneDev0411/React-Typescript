import Fetch from '@app/services/fetch'

export async function inviteUser(brand: UUID, user: UUID): Promise<unknown> {
  return (await new Fetch().post(`/brands/${brand}/invite`).send({ user })).body
    .data
}
