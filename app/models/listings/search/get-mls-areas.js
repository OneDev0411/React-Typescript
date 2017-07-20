import Fetch from '../../../services/fetch'

const getMlsAreas = async () => {
  try {
    const response = await new Fetch().get('/areas/search?parents[]=0')

    return response.body.data.map(({ title, number, parent }) => ({
      parent,
      label: title,
      value: number
    }))
  } catch (error) {
    // console.log(error.message)
  }
}

export default getMlsAreas
