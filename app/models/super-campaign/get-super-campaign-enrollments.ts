// import Fetch from 'services/fetch'

async function getSuperCampaignEnrollments(
  superCampaignId: UUID
): Promise<ISuperCampaignEnrollment<'user_and_brand'>[]> {
  // return (
  //   await new Fetch()
  //     .get(`/email/super-campaigns/${superCampaignId}/enrollments`)
  //     .query({
  //       associations: [
  //         // TODO: Put brand and user associations here
  //       ]
  //     })
  // ).body.data

  // TODO: Remove this when the related API is ready
  const enrollments: ISuperCampaignEnrollment<'user_and_brand'>[] = [
    {
      id: '1',
      brand: { name: 'Mock Brand 1' } as any,
      user: { display_name: 'Mock User 1' } as any,
      tags: ['T1', 'T2', 'T3'],
      super_campaign: superCampaignId,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime()
    },
    {
      id: '2',
      brand: { name: 'Mock Brand 2' } as any,
      user: { display_name: 'Mock User 2' } as any,
      tags: ['T4', 'T5', 'T6'],
      super_campaign: superCampaignId,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime()
    },
    {
      id: '3',
      brand: { name: 'Mock Brand 3' } as any,
      user: { display_name: 'Mock User 3' } as any,
      tags: ['T7', 'T8', 'T9'],
      super_campaign: superCampaignId,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime()
    },
    {
      id: '4',
      brand: { name: 'Mock Brand 4' } as any,
      user: { display_name: 'Mock User 4' } as any,
      tags: ['T10', 'T11', 'T12'],
      super_campaign: superCampaignId,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime()
    },
    {
      id: '5',
      brand: { name: 'Mock Brand 5' } as any,
      user: { display_name: 'Mock User 5' } as any,
      tags: ['T13', 'T14', 'T15'],
      super_campaign: superCampaignId,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime()
    }
  ]

  return enrollments
}

export default getSuperCampaignEnrollments
