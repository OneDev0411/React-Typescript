export interface InlineEditColumnsProps {
  contact: IContact
  callback?: (contactId: UUID) => void
  close?: () => void
}
