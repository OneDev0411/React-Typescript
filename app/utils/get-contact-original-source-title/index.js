export const getContactOriginalSourceTitle = source => {
  if (!source) {
    throw new Error('Source type is required.')
  }

  switch (source) {
    case 'BrokerageWidget':
      return 'Created from a brokerage widget'
    case 'ExplicitlyCreated':
      return 'Created by you'
    case 'IOSAddressBook':
      return 'From your address book'
    case 'SharesRoom':
      return 'Created because you share a room'
    case 'External/Outlook':
      return 'Imported from outlook'
    case 'CSV':
      return 'Imported from CSV'
    default:
      return 'Unknown'
  }
}
