declare type IShowingApprovalAssociations = 'role'

declare interface IShowingApproval<A extends IShowingApprovalAssociations = ''>
  extends IModel<'showing_approval'> {
  appointment: UUID
  role: A extends 'role' ? IShowingRole : UUID
  approved: boolean
  time: string
  comment?: string
}
