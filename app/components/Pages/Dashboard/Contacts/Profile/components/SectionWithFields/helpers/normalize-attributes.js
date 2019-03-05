import { selectDefsBySection } from 'reducers/contacts/attributeDefs'
import { getContactAttributesBySection } from 'models/contacts/helpers'

export function normalizeAttributes(props) {
  let attributes = []
  let sectionAttributesDef = []
  const { contact, section, attributeDefs } = props

  const isParnter = f => (props.isPartner ? f.is_partner : !f.is_partner)

  if (Array.isArray(section)) {
    section.forEach(s => {
      attributes = [
        ...attributes,
        ...getContactAttributesBySection(contact, s).filter(isParnter)
      ]
      sectionAttributesDef = [
        ...sectionAttributesDef,
        ...selectDefsBySection(attributeDefs, s)
      ]
    })
  } else {
    attributes = getContactAttributesBySection(contact, section).filter(
      isParnter
    )
    sectionAttributesDef = selectDefsBySection(attributeDefs, section)
  }

  if (Array.isArray(props.validFields)) {
    const isValid = a => a.name && props.validFields.some(vf => vf === a.name)

    attributes = attributes.filter(f => isValid(f.attribute_def))
    sectionAttributesDef = sectionAttributesDef.filter(isValid)
  }

  return {
    attributeDefs,
    attributes: attributes.map(a => ({ ...a, isActive: false })),
    sectionAttributesDef
  }
}
