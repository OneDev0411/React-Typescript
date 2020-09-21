function adapt(parent: any, template: string): string {
  const type = parent.get('type')

  if (template.startsWith('<mj-section')) {
    return template
  }

  if (type === 'mj-wrapper') {
    return `<mj-section padding="20px 20px" rechat-editable="tree"><mj-column width="100%">${template}</mj-column></mj-section>`
  }

  if (type === 'mj-body') {
    return `<mj-section padding="20px 20px" rechat-editable="tree"><mj-column width="100%">${template}</mj-column></mj-section>`
  }

  return template
}

export default adapt
