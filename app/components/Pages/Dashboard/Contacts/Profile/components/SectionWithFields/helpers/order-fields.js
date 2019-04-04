export function orderFields(fields, orders) {
  const mainFields = []
  const customAttr = []
  const getIndex = def => orders.indexOf(def.name)

  const compareFunc = (a, b) =>
    getIndex(a.attribute_def) - getIndex(b.attribute_def)

  fields.forEach(f =>
    orders.indexOf(f.attribute_def.name) > -1
      ? mainFields.push(f)
      : customAttr.push(f)
  )

  return [...mainFields.sort(compareFunc), ...customAttr].map((f, order) => ({
    ...f,
    order
  }))
}
