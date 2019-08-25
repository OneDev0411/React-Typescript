import { Recipient } from '../types'

export function isContactTag(input: Recipient): input is IContactTag {
  return (input as IContactTag).type === 'crm_tag'
}
