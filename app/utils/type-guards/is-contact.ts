export function isContact(input: IContact | IAgent): input is IContact {
  return input.type === 'contact'
}
