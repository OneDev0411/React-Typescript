import { AvatarProps } from '@material-ui/core'

// base component props
export interface BaseProps extends Omit<AvatarProps, 'src' | 'sizes'> {
  size?: 'small' | 'medium' | 'large'
  user?: IUser
  contact?: IContact | INormalizedContact
  deal?: IDeal
  email?: IEmailCampaign
  url?: string
}

export type Props = RequireOnlyOne<
  BaseProps,
  'user' | 'contact' | 'deal' | 'email' | 'url'
>
