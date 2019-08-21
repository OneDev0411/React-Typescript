export function isContactList(input: any): input is IContactList {
  return (input as IContactList).type === 'contact_list'
}
