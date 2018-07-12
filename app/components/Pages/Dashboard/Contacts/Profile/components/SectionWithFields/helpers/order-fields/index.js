export function orderFields(fields, orders) {
  let orderedList = []
  let customAttributeList = []

  fields.forEach(field => {
    const order = orders.indexOf(field.attribute_def.name)

    if (order === -1) {
      customAttributeList.push(field)
    } else {
      orderedList.push({
        ...field,
        order
      })
    }
  })

  if (customAttributeList.length > 0) {
    customAttributeList.reverse().forEach(field => {
      orderedList.push({
        ...field,
        order: orderedList.length
      })
    })
  }

  return orderedList.sort((a, b) => a.order - b.order)
}
