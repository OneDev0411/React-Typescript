import { Button, ButtonProps } from '@material-ui/core'

import IconDocuSign from 'components/SvgIcons/DocuSign/IconDocuSign'

export function DocuSignConnectButton(props: ButtonProps) {
  return (
    <Button startIcon={<IconDocuSign />} {...props}>
      Connect to DocuSign
    </Button>
  )
}
