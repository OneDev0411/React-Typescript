import { Button, ButtonProps } from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

type SuperCampaignDueAtRemoveButtonProps = Omit<
  ButtonProps,
  'color' | 'size' | 'startIcon'
>

function SuperCampaignDueAtRemoveButton(
  props: SuperCampaignDueAtRemoveButtonProps
) {
  return (
    <Button
      {...props}
      color="secondary"
      size="small"
      startIcon={<SvgIcon path={mdiClose} size={muiIconSizes.small} />}
    >
      Remove
    </Button>
  )
}

export default SuperCampaignDueAtRemoveButton
