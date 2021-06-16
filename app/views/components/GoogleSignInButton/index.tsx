import { Button, ButtonProps } from '@material-ui/core'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'

export function GoogleSignInButton(props: ButtonProps) {
  return (
    <Button startIcon={<IconGoogle />} {...props}>
      Sign in with Google
    </Button>
  )
}
