import { Box, IconButton } from '@material-ui/core'
import { mdiAccountEditOutline, mdiDeleteOutline } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getShowingRoleLabel } from '../../helpers'
import ShowingContactOverviewCard from '../ShowingContactOverviewCard'

interface ShowingStepRolePersonCardProps {
  role: Pick<IShowingRoleInput, 'first_name' | 'last_name' | 'role'>
  onEdit: () => void
  onRemove: () => void
  editable?: boolean
  deletable?: boolean
}

function ShowingStepRolePersonCard({
  role,
  onEdit,
  onRemove,
  editable = true,
  deletable = true
}: ShowingStepRolePersonCardProps) {
  return (
    <ShowingContactOverviewCard
      fullName={`${role.first_name} ${role.last_name}`}
      subtitle={`Listing ${getShowingRoleLabel(role.role)}`}
      actions={
        (editable || deletable) && (
          <>
            {editable && (
              <Box pl={2}>
                <IconButton size="medium" onClick={onEdit}>
                  <SvgIcon
                    path={mdiAccountEditOutline}
                    size={muiIconSizes.medium}
                  />
                </IconButton>
              </Box>
            )}

            {deletable && (
              <Box>
                <IconButton size="medium" onClick={onRemove}>
                  <SvgIcon path={mdiDeleteOutline} size={muiIconSizes.medium} />
                </IconButton>
              </Box>
            )}
          </>
        )
      }
    />
  )
}

export default ShowingStepRolePersonCard
