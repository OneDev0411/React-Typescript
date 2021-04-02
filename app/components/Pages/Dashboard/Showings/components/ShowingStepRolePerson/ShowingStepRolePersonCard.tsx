import React from 'react'

import { Box, IconButton } from '@material-ui/core'

import { mdiAccountEditOutline, mdiDeleteOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ShowingRolePerson } from '../../types'

import ShowingContactOverviewCard from '../ShowingContactOverviewCard'

interface ShowingStepRolePersonCardProps {
  person: ShowingRolePerson
  roleType: IShowingRoleType
  onEdit: () => void
  onRemove: () => void
}

function ShowingStepRolePersonCard({
  person,
  onEdit,
  onRemove,
  roleType
}: ShowingStepRolePersonCardProps) {
  return (
    <ShowingContactOverviewCard
      fullName={`${person.first_name} ${person.last_name}`}
      subtitle={`Listing ${roleType}`}
      actions={
        <>
          <Box pl={2}>
            <IconButton size="medium" onClick={onEdit}>
              <SvgIcon
                path={mdiAccountEditOutline}
                size={muiIconSizes.medium}
              />
            </IconButton>
          </Box>

          <Box>
            <IconButton size="medium" onClick={onRemove}>
              <SvgIcon path={mdiDeleteOutline} size={muiIconSizes.medium} />
            </IconButton>
          </Box>
        </>
      }
    />
  )
}

export default ShowingStepRolePersonCard
