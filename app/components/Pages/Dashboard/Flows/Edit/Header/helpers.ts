import {
  MAX_FLOW_NAME_LENGTH,
  MAX_FLOW_DESCRIPTION_LENGTH,
  TOO_LONG_INPUT_ERROR_MESSAGE
} from '../../constants'

export function nameValidate(value: string): string {
  if (value.length === 0) {
    return 'Required!'
  }

  if (value.length > MAX_FLOW_NAME_LENGTH) {
    return TOO_LONG_INPUT_ERROR_MESSAGE
  }

  return ''
}

export function descriptionValidate(value: string): string {
  if (value.length > MAX_FLOW_DESCRIPTION_LENGTH) {
    return TOO_LONG_INPUT_ERROR_MESSAGE
  }

  return ''
}
