import { ORIGINS } from '../../components/Pages/Dashboard/Contacts/List/constants'

export const getContactOriginalSourceTitle = source => {
  const foundOrigin = ORIGINS.find(origin => origin.value === source)
  return foundOrigin ? foundOrigin.description : 'Unknown'
}
