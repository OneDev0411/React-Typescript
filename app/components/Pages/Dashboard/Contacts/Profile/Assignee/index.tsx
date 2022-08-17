import { useState } from 'react'

import {
  Popover,
  List,
  ListItemText,
  ListItem,
  ListItemIcon
} from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import { addAssignee } from '@app/models/assignees/add-assignee'
import { BrandedUser } from '@app/views/components/TeamAgents/types'
import { AgentsList } from '@app/views/components/TeamAgentsDrawer/List'
import UserAvatar from '@app/views/components/UserAvatar'

import { IDealFormRole } from '../../../Deals/Create/types'
import { BasicSection } from '../components/Section/Basic'
import { SectionButton } from '../components/Section/Button'

interface Props {
  assigned?: IDealFormRole[] | null | undefined
  contact: INormalizedContact
  submitCallback: (
    newContact: INormalizedContact,
    updatedAttribute: IContactAttributeDef
  ) => void
}

const Assignee = ({ assigned, contact, submitCallback }: Props) => {
  // Need To Find how this submit callback works
  // Then Refect the Contact after adding the assignee
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAgentSelection = async (role: BrandedUser) => {
    const data = addAssignee(contact.id, {
      assignees: [
        {
          user: '41c793d0-c63d-11e7-a9c6-0242ac11000d',
          brand: '317f39d2-bc42-11e8-aff4-0a95998482ac'
        }
      ]
    })

    console.log(data)
  }

  console.log('Contact', contact)

  const open = Boolean(anchorEl)
  const id = open ? 'assignee-popover' : undefined

  return (
    <BasicSection title="Assignee">
      <List component="nav">
        <ListItem button>
          <ListItemIcon>
            <UserAvatar name="TEST" />
          </ListItemIcon>
          <ListItemText primary="TEST" />
        </ListItem>
        {/* {assigned.map(role => (
          <ListItem button onClick={handleDelete}>
            <ListItemIcon>
              <UserAvatar name={role.legal_first_name}></UserAvatar>
            </ListItemIcon>
            <ListItemText primary={role.legal_first_name} />
          </ListItem>
        ))} */}
      </List>

      <SectionButton
        aria-describedby={id}
        onClick={handleClick}
        label="Add new assignee"
        icon={mdiPlus}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <AgentsList
          flattenTeams
          useTeamBrandId
          isPrimaryAgent={false}
          onSelectAgent={handleAgentSelection}
        />
      </Popover>
    </BasicSection>
  )
}

export default Assignee
