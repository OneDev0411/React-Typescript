import _ from 'underscore'

export default function(filters) {
  const list = {}

  filters.forEach(filter => {
    list[_.uniqueId()] = {
      id: 'tag',
      isActive: false,
      isIncomplete: false,
      values: [filter.value],
      operator: {
        name: filter.invert ? 'is not' : 'is',
        invert: filter.invert
      }
    }
  })

  return list
}
