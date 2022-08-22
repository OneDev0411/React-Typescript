import { Box, Typography } from '@material-ui/core'

import { BrandedUser } from './types'
import { UserRow } from './UserRow'

export enum RowType {
  Header,
  User
}

export type RowItem =
  | {
      type: RowType.Header
      name?: string
      subtitle?: string
    }
  | {
      type: RowType.User
      teamId?: UUID
      user: IUser
    }

interface Props {
  index: number
  style: React.CSSProperties
  data: {
    rows: RowItem[]
    useTeamBrandId: boolean
    onSelectAgent: (agent: BrandedUser) => void
  }
}

export function Row({
  index,
  style,
  data: { rows, useTeamBrandId, onSelectAgent }
}: Props) {
  const row = rows[index]

  if (row.type === RowType.Header) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        pl={1}
        style={style}
      >
        <Typography variant="subtitle2">{row.name}</Typography>
        <Typography variant="caption">{row.subtitle}</Typography>
      </Box>
    )
  }

  return (
    <div style={style}>
      <UserRow
        name={row.user.display_name}
        email={row.user.email}
        avatarUrl={row.user.profile_image_url!}
        onClick={() =>
          onSelectAgent({
            ...row.user,
            brand_id: useTeamBrandId ? row.teamId : null
          })
        }
      />
    </div>
  )
}
