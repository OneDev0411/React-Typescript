import { Button, ButtonProps } from '@material-ui/core'

import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

export function OutlookSignInButton(props: ButtonProps) {
  return (
    <Button startIcon={<IconOutlook />} {...props}>
      Sign in with Outlook
    </Button>
  )
}
