import Fetch from 'services/fetch'

async function getShowings() {
  return (
    await new Fetch().post(
      '/showings/filter?associations[]=showing.listing&associations[]=showing.deal'
    )
  ).body.data as IShowing[]
}

export default getShowings
