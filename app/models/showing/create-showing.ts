import Fetch from 'services/fetch'

async function createShowing(data: IShowingInputAPI): Promise<IShowing> {
  return (await new Fetch().post('/showings').send(data)).body.data
}

export default createShowing
