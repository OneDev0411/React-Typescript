import _ from 'underscore'

export function getAnnotationsByType(annotations, type) {
  const list = []

  _.each(annotations, page => {
    _.each(page[type], (groups, name) => {
      _.each(groups, group => {
        list.push(group)
      })
    })
  })

  return list
}
