import { Button, ButtonProps } from '@material-ui/core'

import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

export function OutlookSignInButton(props: ButtonProps) {
  console.log('hiiii')

  return (
    <Button startIcon={<IconOutlook />} {...props}>
      Sign in with Google
    </Button>
  )
}
