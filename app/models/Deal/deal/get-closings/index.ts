import Fetch from '@app/services/fetch'

export async function getClosings(): Promise<IDeal[]> {
  // TODO: add the 14 days limitation to the filter
  return (
    await new Fetch().post('/deals/filter').query({
      // TODO: Ask Ramin or Emil about the required associations
      associations: ['deal.brand']
    })
  ).body.data
}
