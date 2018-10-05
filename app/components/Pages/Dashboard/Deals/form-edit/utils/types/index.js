const TEXT_ANNOTATION = 1
const RADIO_ANNOTATION = 2
const CHECKBOX_ANNOTATION = 3
const UNKNOWN_ANNOTATION = 4

const Types = {
  TEXT_ANNOTATION,
  RADIO_ANNOTATION,
  CHECKBOX_ANNOTATION,
  UNKNOWN_ANNOTATION
}


const getType = (annotation) => {
  if (annotation.fieldType === 'Tx') {
    return TEXT_ANNOTATION
  }

  if (annotation.fieldType === 'Btn') {
    if (annotation.fieldFlags & 32768) {
      return RADIO_ANNOTATION
    }

    return CHECKBOX_ANNOTATION
  }

  return UNKNOWN_ANNOTATION
}

const getValue = (annotation) => {
  const { fieldValue, buttonValue } = annotation

  const type = getType(annotation)

  if (type === TEXT_ANNOTATION) {
    return fieldValue || ''
  }

  if (type === CHECKBOX_ANNOTATION) {
    return fieldValue && fieldValue !== 'Off'
  }

  if (type === Types.RADIO_ANNOTATION) {
    return fieldValue === buttonValue
  }

  return ''
}

export { getType, getValue, Types }