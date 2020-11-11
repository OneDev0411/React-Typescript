import superagent from 'superagent'

const API_URL = '/api/my-marketing-matters/punchout'

interface PunchoutResponse {
  response?: {
    url: 'string'
  }
  error?: string
}

export async function sendPunchOutRequest(
  user: IUser,
  deal: IDeal,
  costCenter: string,
  redirectUrl: string
): Promise<PunchoutResponse> {
  const response = await superagent
    .post(API_URL)
    .send({ deal, user, costCenter, redirectUrl })

  return response.body
}
