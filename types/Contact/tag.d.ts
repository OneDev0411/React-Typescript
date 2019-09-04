declare interface ICRMTag extends IModel<'crm_tag'> {
  created_by: UUID
  updated_by: UUID
  tag: string
  text: string
  touch_freq: number
  // This is used only for the web on the client side
  highlight?: boolean
}

declare interface ICRMDefaultTag {
  text: string
  highlight?: boolean
  type: 'default_Tag'
}
