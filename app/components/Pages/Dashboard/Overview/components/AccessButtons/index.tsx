import { Box } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { AccessButton } from '@app/components/Pages/Dashboard/Overview/components/AccessButton'
import { ACL } from '@app/constants/acl'
import { selectIntercom } from '@app/selectors/intercom'
import { activateIntercom } from '@app/store_actions/intercom'
import { InboxAction } from 'reducers/inbox/types'

import { AccessButtonType } from '../../types.d'

const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
const insightAccess = { oneOf: [ACL.MARKETING, ACL.CRM] }
const marketingAccess = { oneOf: [ACL.MARKETING, ACL.AGENT_NETWORK] }

const styles = makeStyles(
  (theme: Theme) => ({
    container: {
      margin: theme.spacing(3, 0)
    }
  }),
  { name: 'AccessButtons' }
)

export function AccessButtons() {
  const classes = styles()
  const dispatch = useDispatch<ThunkDispatch<any, any, InboxAction>>()

  const { isActive: isIntercomActive } = useSelector(selectIntercom)

  const handleOpenSupportDialogueBox = () =>
    !isIntercomActive && dispatch(activateIntercom(isIntercomActive))

  const handleOpenExternalLink = link =>
    window.open(link, '_blank', 'noopener noreferrer')

  const AccessItems: AccessButtonType[] = [
    {
      access: marketingAccess,
      id: 'marketing',
      label: 'Marketing',
      to: '/dashboard/marketing'
    },
    {
      access: dealsAccess,
      id: 'deals',
      label: 'Deals',
      to: '/dashboard/deals'
    },
    {
      access: ['CRM'],
      id: 'contacts',
      label: 'Contacts',
      to: '/dashboard/contacts'
    },
    {
      access: ['AgentNetwork'],
      id: 'agent-network',
      label: 'Agent Network',
      to: '/dashboard/agent-network'
    },
    {
      access: insightAccess,
      id: 'insight',
      label: 'Insight',
      to: '/dashboard/insights'
    },
    {
      id: 'blog',
      label: 'Blog',
      action: () => handleOpenExternalLink('https://rechat.com/blog/')
    },
    {
      access: ({ user }) => !!user,
      id: 'support',
      label: 'Support',
      action: handleOpenSupportDialogueBox
    }
  ]

  return (
    <Box className={classes.container}>
      {AccessItems.map(item => (
        <AccessButton key={item.id} data={item} />
      ))}
    </Box>
  )
}
