import { useField } from 'react-final-form'

export const useRecipientFields = () => ({
  from: useField('from'),
  to: useField('to'),
  cc: useField('cc'),
  bcc: useField('bcc')
})
