import { Box } from '@material-ui/core'

import { muiIconSizes } from '@app/views/components/SvgIcons'
import { eventTypesIcons } from '@app/views/utils/event-types-icons'

interface Props {
  type: CRMTaskTypes
}

export function TaskTypeCell({ type }: Props) {
  return (
    <Box display="flex" alignItems="center">
      {eventTypesIcons[type].icon({
        size: muiIconSizes.small
      })}

      <Box ml={1}>{type}</Box>
    </Box>
  )
}
