import Fetch from 'services/fetch'

async function getMySuperCampaignEnrollments(): Promise<
  ISuperCampaignEnrollment[]
> {
  return (await new Fetch().get('/email/super-campaigns/enrollments/self')).body
    .data
}

export default getMySuperCampaignEnrollments
