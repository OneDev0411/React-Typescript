function adapt(parent: any, template: string): string {
  const type = parent.get('type')

  if (type === 'mj-section') {
    return `<mj-column width="100%">${template}</mj-column>`
  }

  if (type === 'mj-wrapper') {
    return `<mj-section><mj-column width="100%">${template}</mj-column></mj-section>`
  }

  return template
}

export default adapt
