function adapt(parent: any, template: string): string {
  const type = parent.get('type')

  if (type === 'mj-wrapper') {
    return `<mj-section padding="5px 20px"><mj-column width="100%">${template}</mj-column></mj-section>`
  }

  if (type === 'mj-body') {
    return `<mj-section padding="5px 20px" background-color="#fff"><mj-column width="100%">${template}</mj-column></mj-section>`
  }

  return template
}

export default adapt
