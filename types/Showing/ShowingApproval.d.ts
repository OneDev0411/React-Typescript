declare interface IShowingApproval extends IModel<'showing_approval'> {
  appointment: UUID
  role: UUID | IShowingRole
  approved: boolean
  time: string
  comment?: string
}
