import _get from 'lodash/get'

import { TEMPLATE_VARIABLE_SECTIONS } from './constants'
import { TemplateVariableSectionWithItems } from './types'

export function getEditableVariablesSections(
  templates: IBrandMarketingTemplate[],
  data: {
    user: IUser
    listing: Nullable<IListing>
  }
): TemplateVariableSectionWithItems[] {
  const templatesVariables = [
    ...new Set(templates.flatMap(template => template.template.variables ?? []))
  ]

  return TEMPLATE_VARIABLE_SECTIONS.map(section => {
    return {
      ...section,
      items: section.items
        .filter(variable => templatesVariables.includes(variable.name))
        .map(item => ({
          ...item,
          value: _get(data, item.name)
        }))
    }
  }).filter(section => section.items.length > 0)
}
