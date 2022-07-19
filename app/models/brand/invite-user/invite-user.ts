import Fetch from '@app/services/fetch'

export interface InviteUserDataInput {
  brand: UUID
  user: UUID
}

export async function inviteUser({
  brand,
  user
}: InviteUserDataInput): Promise<void> {
  return (await new Fetch().post(`/brands/${brand}/invite`).send({ user })).body
}
