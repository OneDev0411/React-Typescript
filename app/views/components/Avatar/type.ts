import { AvatarProps } from '@material-ui/core'

export interface BaseProps extends Omit<AvatarProps, 'src' | 'sizes'> {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'
  showStatus?: boolean
  disableLazyLoad?: boolean
  isOnline?: boolean
  statusColor?: string
  placeHolderImage?: string
  user?: IUser | IOAuthAccount
  contact?: IContact | INormalizedContact
  email?: IEmailCampaign
  url?: string
}

export type Props = RequireOnlyOne<
  BaseProps,
  'user' | 'contact' | 'email' | 'url'
>
