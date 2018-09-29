import Fetch from '../../../services/fetch'

const getCalenderFeed = async (types, selectedMembers) => {
  let url = `/calendar/feed?types[]=${types.join('&types[]=')}`

  if (selectedMembers) {
    url += `&users[]=${[].concat
      .apply([], Object.values(selectedMembers))
      .join('&users[]=')}`
  }

  try {
    const response = await new Fetch().get(url)

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getCalenderFeed
