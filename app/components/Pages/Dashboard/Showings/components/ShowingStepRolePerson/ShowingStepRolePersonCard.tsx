import { kebabCase, upperFirst } from 'lodash'

import { Box, IconButton } from '@material-ui/core'

import { mdiAccountEditOutline, mdiDeleteOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import ShowingContactOverviewCard from '../ShowingContactOverviewCard'

interface ShowingStepRolePersonCardProps {
  person: IShowingRoleInputPerson
  personTitle: string
  onEdit: () => void
  onRemove: () => void
  editable?: boolean
}

function ShowingStepRolePersonCard({
  person,
  onEdit,
  onRemove,
  personTitle,
  editable = false
}: ShowingStepRolePersonCardProps) {
  return (
    <ShowingContactOverviewCard
      fullName={`${person.first_name} ${person.last_name}`}
      subtitle={`Listing ${upperFirst(kebabCase(personTitle))}`}
      actions={
        editable && (
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
        )
      }
    />
  )
}

export default ShowingStepRolePersonCard
