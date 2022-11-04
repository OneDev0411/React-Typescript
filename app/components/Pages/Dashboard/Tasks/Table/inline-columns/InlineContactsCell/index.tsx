import { useEffect, useState } from 'react'

import {
  Box,
  IconButton,
  MenuItem,
  Theme,
  Typography,
  useTheme
} from '@material-ui/core'
import { mdiOpenInNew, mdiTrashCanOutline } from '@mdi/js'

import { getContactNameInitials } from '@app/models/contacts/helpers'
import { Avatar } from '@app/views/components/Avatar'
import { ContactsList } from '@app/views/components/ContactsList'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { useTaskMutation } from '../../../queries/use-task-mutation'
import type { ITask } from '../../../types'

type TaskAssociation = ICRMTaskAssociation<'contact' | 'deal' | 'listing'>
interface Props {
  task: ITask
  closeHandler: () => void
}

export function InlineContactsCell({ task, closeHandler }: Props) {
  console.log('task contact', task)

  const mutation = useTaskMutation(task)

  const [contacts, setContacts] = useState(
    task.associations?.filter(
      association => association.association_type === 'contact'
    ) ?? []
  )
  const [showContactsList, setShowContactsList] = useState(
    contacts.length === 0
  )
  const theme = useTheme<Theme>()

  useEffect(() => {
    if (contacts.length === 0) {
      setShowContactsList(true)
    }
  }, [contacts.length])

  const handleDelete = (id: UUID) => {
    const nextAssociations = contacts.filter(item => item.contact?.id !== id)

    setContacts(nextAssociations)

    mutation.mutate({
      associations: nextAssociations.map(association => ({
        association_type: 'contact',
        id: association.id,
        contact: association.contact
      })) as unknown as TaskAssociation[]
    })
  }

  const onChangeContact = (list: IContact[]) => {
    mutation.mutate({
      associations: [
        ...contacts,
        ...(list.map(contact => ({
          association_type: 'contact',
          contact
        })) as unknown as TaskAssociation[])
      ]
    })
  }

  return (
    <>
      {showContactsList ? (
        <ContactsList
          defaultSelectedContacts={contacts.map(
            association => association.contact as IContact
          )}
          onChange={onChangeContact}
        />
      ) : (
        <>
          {contacts.map(({ contact }) => (
            <MenuItem key={contact!.id}>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" mr={4}>
                  <Avatar contact={contact!} size="small">
                    {getContactNameInitials(contact)}
                  </Avatar>

                  <Box ml={1}>{contact!.display_name}</Box>
                </Box>

                <div>
                  <IconButton
                    size="small"
                    onClick={() =>
                      window.open(`/dashboard/contacts/${contact!.id}`)
                    }
                  >
                    <SvgIcon
                      path={mdiOpenInNew}
                      size={muiIconSizes.small}
                      color={theme.palette.action.disabled}
                    />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => handleDelete(contact!.id)}
                  >
                    <SvgIcon
                      path={mdiTrashCanOutline}
                      size={muiIconSizes.small}
                      color={theme.palette.action.disabled}
                    />
                  </IconButton>
                </div>
              </Box>
            </MenuItem>
          ))}

          <MenuItem onClick={() => setShowContactsList(true)}>
            <Typography variant="body1" color="primary">
              Add Contact
            </Typography>
          </MenuItem>
        </>
      )}
    </>
  )
}
