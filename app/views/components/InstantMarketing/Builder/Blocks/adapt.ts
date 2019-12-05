function adapt(parent: any, template: string): string {
  const type = parent.get('type')

  let adapted = template

  if (type === 'mj-section') {
    adapted = `<mj-column>${template}</mj-column>`
  }

  if (type === 'mj-wrapper') {
    adapted = `<mj-section><mj-column>${template}</mj-column></mj-section>`
  }

  return adapted
}

export default adapt
