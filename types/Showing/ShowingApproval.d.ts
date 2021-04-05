declare interface IShowingApproval extends IModel<'showing_approval'> {
  appointment: UUID
  role: UUID
  approved: boolean
  time: string
  comment?: string
}
