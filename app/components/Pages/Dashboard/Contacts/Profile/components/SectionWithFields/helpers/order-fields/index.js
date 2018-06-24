export function orderFields(fields, orders) {
  let orderedList = []

  fields.forEach(field => {
    const order = orders.indexOf(field.attribute_def.name)

    if (order === -1) {
      return
    }

    orderedList.push({
      ...field,
      order
    })
  })

  return orderedList.sort((a, b) => a.order - b.order)
}
