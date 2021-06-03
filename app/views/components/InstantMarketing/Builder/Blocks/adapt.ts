import { Model } from 'grapesjs'

function adapt(parent: Model, template: string): string {
  const type: string = parent.get('type')

  if (template.startsWith('<mj-section')) {
    return template
  }

  if (type === 'mj-wrapper') {
    return `<mj-section mj-class="container" padding-top="20px" padding-bottom="20px" rechat-editable="tree"><mj-column width="100%">${template}</mj-column></mj-section>`
  }

  if (type === 'mj-body') {
    return `<mj-section mj-class="container" padding-top="20px" padding-bottom="20px" rechat-editable="tree"><mj-column width="100%">${template}</mj-column></mj-section>`
  }

  return template
}

export default adapt
