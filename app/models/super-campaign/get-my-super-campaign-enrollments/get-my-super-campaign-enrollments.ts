import Fetch from 'services/fetch'

export async function getMySuperCampaignEnrollments(): Promise<
  ISuperCampaignEnrollment[]
> {
  return (await new Fetch().get('/email/super-campaigns/enrollments/self')).body
    .data
}
