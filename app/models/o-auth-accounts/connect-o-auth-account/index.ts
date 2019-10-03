import Fetch from 'services/fetch'

export async function connectOAuthAccount(
  provider: string,
  redirect: string = window.location.href,
  scopes?: IGoogleScope[]
): Promise<IOAuthAccountImport> {
  const response = await new Fetch().post(`/users/self/${provider}`).send({
    scopes,
    redirect
  })

  return response.body && response.body.data
}
