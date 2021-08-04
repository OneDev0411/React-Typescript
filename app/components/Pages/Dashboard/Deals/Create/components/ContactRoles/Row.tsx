import { Box, Avatar, Typography, Theme, makeStyles } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import cn from 'classnames'

import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { convertContactToRole, convertAgentToRole } from '../../../utils/roles'
import type { IDealFormRole } from '../../types'

export enum RowType {
  New,
  Contact,
  Agent
}

export type RowItem =
  | {
      type: RowType.New
      name: string
    }
  | {
      type: RowType.Contact
      contact: IContact
    }
  | {
      type: RowType.Agent
      agent: IAgent
    }

interface Props {
  index: number
  style: React.CSSProperties
  data: {
    rows: RowItem[]
    onCreateNewContact: () => void
    onSelectRole: (role: Partial<IDealFormRole>) => void
  }
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    row: {
      padding: theme.spacing(1),
      '&:hover': {
        background: theme.palette.action.hover,
        cursor: 'pointer'
      }
    },
    rowContent: {
      paddingLeft: theme.spacing(2)
    },
    email: {
      color: theme.palette.grey[500]
    },
    newClientAvatar: {
      border: `1px solid ${theme.palette.secondary.main}`,
      backgroundColor: '#fff'
    },
    newClient: {
      color: theme.palette.secondary.main
    }
  }),
  {
    name: 'ContactRole-Row'
  }
)

export function Row({
  index,
  style,
  data: { rows, onCreateNewContact, onSelectRole }
}: Props) {
  const classes = useStyles()
  const row = rows[index]

  return (
    <div style={style}>
      {row.type === RowType.New && (
        <Box
          display="flex"
          alignItems="center"
          className={cn(classes.row, classes.newClient)}
          onClick={onCreateNewContact}
        >
          <Avatar className={classes.newClientAvatar}>
            <SvgIcon path={mdiPlus} className={classes.newClient} />
          </Avatar>

          <div className={classes.rowContent}>
            Add <strong>{row.name}</strong>
          </div>
        </Box>
      )}

      {row.type === RowType.Contact && (
        <Box
          display="flex"
          className={classes.row}
          onClick={() => onSelectRole(convertContactToRole(row.contact))}
        >
          <Avatar
            src={row.contact.profile_image_url!}
            alt={row.contact.display_name}
          />

          <div className={classes.rowContent}>
            <Typography variant="body2">{row.contact.display_name}</Typography>

            <Typography variant="body2" className={classes.email}>
              {row.contact.email}
            </Typography>
          </div>
        </Box>
      )}

      {row.type === RowType.Agent && (
        <Box
          display="flex"
          className={classes.row}
          onClick={() => onSelectRole(convertAgentToRole(row.agent))}
        >
          <Avatar src={row.agent.profile_image_url!} />

          <div className={classes.rowContent}>
            <Typography variant="body2">
              <TextMiddleTruncate text={row.agent.full_name} maxLength={35} />
            </Typography>

            <Typography variant="body2" className={classes.email}>
              <TextMiddleTruncate
                text={row.agent.mlsid || row.agent.email}
                maxLength={35}
              />
            </Typography>
          </div>
        </Box>
      )}
    </div>
  )
}
