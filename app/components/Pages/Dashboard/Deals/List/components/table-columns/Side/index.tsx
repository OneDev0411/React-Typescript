import { makeStyles, Typography } from '@material-ui/core'

import { Avatar } from 'components/Avatar'
import PopOver from 'components/Popover'
import { getSide } from 'models/Deal/helpers/context/get-side'

import { RoleName } from '../../../../components/Roles/RoleName'
import { getLegalFullName } from '../../../../utils/roles'

const useStyles = makeStyles(
  theme => ({
    container: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    circle: {
      width: theme.spacing(0.5),
      height: theme.spacing(0.5),
      margin: theme.spacing(0, 1),
      borderRadius: '100%',
      backgroundColor: theme.palette.grey[500]
    }
  }),
  {
    name: 'AgentGridSide'
  }
)

interface Props {
  deal: IDeal
  roles: Record<UUID, IDealRole>
  rowId: number
  rowsCount: number
}

export function Side({ deal, roles, rowId, rowsCount }: Props) {
  const classes = useStyles()

  const sideName = getSide(deal)
  const dealRoles = (deal.roles || []) as unknown[]

  const relatedRole: UUID = dealRoles.find(
    (id: UUID) => roles[id].role === sideName
  ) as UUID

  if (!deal.roles) {
    return <Typography variant="caption">{getSide(deal)}</Typography>
  }

  const relatedRoleName = roles[relatedRole]?.legal_full_name || undefined

  return (
    <PopOver
      placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
      id={`popover-trigger-sides-${deal.id}`}
      caption={
        <div className="roles">
          {dealRoles.map((id: UUID) => {
            const role = roles[id]

            return (
              <div key={`ROLE_${role.id}`} className="item">
                <div className="avatar">
                  <Avatar
                    alt={`${role.legal_first_name} ${role.legal_last_name}`}
                    user={role.user}
                  />
                </div>
                <div className="info">
                  <div className="role-name-container">
                    <div className="name">{`${getLegalFullName(role)},`}</div>

                    <div className="role">
                      <RoleName name={role.role} />
                    </div>
                  </div>
                  {role.user && <div className="email">{role.user.email}</div>}
                </div>
              </div>
            )
          })}
        </div>
      }
    >
      {relatedRoleName && (
        <div className={classes.container}>
          <div className={classes.circle} />
          <div
            className="underline-on-hover"
            style={{
              cursor: 'help'
            }}
          >
            <Typography variant="caption">{relatedRoleName}</Typography>
          </div>
        </div>
      )}
    </PopOver>
  )
}
