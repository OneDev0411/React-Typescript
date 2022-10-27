import { Grid } from '@material-ui/core'

import UserAvatar from '@app/views/components/UserAvatar'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

interface Props {
  assignees?: Nullable<IAssignee[]>
}

const MAX_ASSIGNEES_TO_SHOW = 4

export function AssigneesCell({ assignees }: Props) {
  if (!assignees) {
    return null
  }

  const assigneesToShow =
    assignees.length === MAX_ASSIGNEES_TO_SHOW
      ? MAX_ASSIGNEES_TO_SHOW
      : MAX_ASSIGNEES_TO_SHOW - 1

  return (
    <Grid container spacing={1}>
      {assignees.slice(0, assigneesToShow).map(assignee => (
        <Grid item key={assignee.id}>
          <UserAvatar
            size={muiIconSizes.medium}
            image={assignee.user?.profile_image_url}
            name={assignee.user?.display_name}
            showStateIndicator={false}
          />
        </Grid>
      ))}
      {assignees.length > MAX_ASSIGNEES_TO_SHOW && (
        <Grid item>
          <UserAvatar
            size={muiIconSizes.medium}
            name={`+ ${assignees.length - MAX_ASSIGNEES_TO_SHOW + 1}`}
            showStateIndicator={false}
          />
        </Grid>
      )}
    </Grid>
  )
}
