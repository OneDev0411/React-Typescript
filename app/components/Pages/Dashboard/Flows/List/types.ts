export interface FlowAction {
  label: string
  value: 'view' | 'edit' | 'delete' | 'duplicate'
}
