export type MiniContactType = 'contact' | 'user' | 'insight'

export enum ActionSettingsNamesType {
  EVENT = 'event',
  CONTACT = 'contact',
  EMAIL = 'email'
}
export interface ActionSettingsType {
  type?: ActionSettingsNamesType
  data?: any
}

export enum SocialMediasEnum {
  instagram = 'instagram',
  facebook = 'facebook',
  linkedin = 'linkedin'
}
