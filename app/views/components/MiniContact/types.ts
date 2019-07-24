export type MiniContactType = 'contact' | 'user' | 'insight'

export enum ActionSettingsNamesType {
  EVENT = 'event',
  CONTACT = 'contact'
}
export interface ActionSettingsType {
  type?: ActionSettingsNamesType
  data?: any
}
