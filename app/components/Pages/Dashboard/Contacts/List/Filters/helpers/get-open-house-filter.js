import fecha from 'fecha'

function getOpenHouseFilter(openHouse) {
  return {
    label: `${openHouse.title} - ${fecha.format(
      new Date(openHouse.due_date * 1000),
      'mediumDate'
    )}`,
    value: openHouse.id
  }
}

export default getOpenHouseFilter
