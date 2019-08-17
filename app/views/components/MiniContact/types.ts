export type MiniContactType = 'contact' | 'user' | 'insight'

export type ProfileDateType = {
  title: string
  date: number
}

export interface ProfileType {
  name?: string
  email?: string
  phone?: string
  address?: string
  profile_image_url?: string
  last_touch?: number
  dates?: ProfileDateType[]
  socials?: SocialMediasType[]
}

type StatusType = 'loading' | 'failed' | 'finished' | 'not_started'

export interface FormatterOutputType {
  contact_status: StatusType
  contact_id: UUID
  data: ProfileType
  meta: {
    association?: any
    first_name?: string
    last_name?: string
  }
}

export interface SocialMediasType {
  type: string
  url: string
}

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
