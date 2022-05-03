import { Button, ButtonProps } from '@material-ui/core'
import { mdiHelpCircleOutline } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

type HowToConnectToInstagramButtonProps = Omit<
  ButtonProps,
  'size' | 'startIcon' | 'children'
>

function HowToConnectToInstagramButton(
  props: HowToConnectToInstagramButtonProps
) {
  return (
    <Button
      {...props}
      size="small"
      startIcon={
        <SvgIcon path={mdiHelpCircleOutline} size={muiIconSizes.small} />
      }
    >
      How to connect to Instagram
    </Button>
  )
}

export default HowToConnectToInstagramButton
