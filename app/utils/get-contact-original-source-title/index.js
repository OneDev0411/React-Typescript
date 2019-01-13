export const getContactOriginalSourceTitle = source => {
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
    case 'OpenHouse':
      return 'Created from an open house registration'
    default:
      return 'Unknown'
  }
}
