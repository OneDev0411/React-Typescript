import Fetch from 'services/fetch'

async function createShowing(data: IShowingInput) {
  return (await new Fetch().post('/showings').send(data)).body.data as IShowing
}

export default createShowing
