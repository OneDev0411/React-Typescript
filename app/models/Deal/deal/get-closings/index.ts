import { addDays } from 'date-fns'

import Fetch from '@app/services/fetch'

export async function getClosings(days: number = 14): Promise<IDeal[]> {
  return (
    await new Fetch({ proxy: false })
      .post('/deals/filter')
      .query({
        // TODO: Ask Ramin or Emil about the required associations
        associations: ['deal.brand']
      })
      .send({
        contexts: {
          closing_date: {
            date: {
              from: new Date().toISOString(),
              to: addDays(new Date(), days).toISOString()
            }
          }
        }
      })
  ).body.data
}
