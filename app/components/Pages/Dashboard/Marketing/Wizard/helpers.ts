import _get from 'lodash/get'

import { TEMPLATE_VARIABLES } from './constants'
import { TemplateVariable, TemplateVariableType } from './types'

export function getEditableVariables(
  templates: IBrandMarketingTemplate[],
  data: {
    user: IUser
    listing: Nullable<IListing>
  }
): TemplateVariable<TemplateVariableType>[] {
  const currentTemplatesVariableNames = [
    ...new Set(templates.flatMap(template => template.template.variables ?? []))
  ]

  return TEMPLATE_VARIABLES.filter(item => {
    if (item.type === 'sortableImageList') {
      return item.images.some(imageItem =>
        currentTemplatesVariableNames.includes(imageItem.name)
      )
    }

    return currentTemplatesVariableNames.includes(item.name)
  }).map(item => {
    if (item.type === 'sortableImageList') {
      return {
        ...item,
        images: item.images.map(imageItem => {
          return {
            ...imageItem,
            value: _get(data, imageItem.name)
          }
        })
      }
    }

    return {
      ...item,
      value: _get(data, item.name)
    }
  })
}
