import { Chip } from '@material-ui/core'
import { mdiAlertOutline } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

function SocialPostFailedChip() {
  return (
    <Chip
      variant="outlined"
      size="small"
      icon={<SvgIcon path={mdiAlertOutline} size={muiIconSizes.small} />}
      label="Failed to Post"
    />
  )
}

export default SocialPostFailedChip
