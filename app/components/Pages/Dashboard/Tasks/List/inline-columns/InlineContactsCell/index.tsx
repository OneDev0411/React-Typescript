import { useState } from 'react'

import {
  Box,
  IconButton,
  MenuItem,
  Theme,
  Typography,
  useTheme
} from '@material-ui/core'
import { mdiOpenInNew, mdiTrashCanOutline } from '@mdi/js'

import { ContactsList } from '@app/views/components/ContactsList'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { useTaskMutation } from '../../../queries/use-task-mutation'
import type { ITask } from '../../../types'

interface Props {
  task: ITask
  closeHandler: () => void
}

export function InlineContactsCell({ task, closeHandler }: Props) {
  const mutation = useTaskMutation(task)
  const [contacts, setContacts] = useState(
    task.associations?.filter(
      association => association.association_type === 'contact'
    )
  )
  const [showContactsList, setShowContactsList] = useState(false)
  const theme = useTheme<Theme>()

  const handleDelete = (id: UUID) => {
    setContacts(list => list?.filter(item => item.contact?.id !== id))
  }

  const onChangeContact = (list: IContact[]) => {
    const associations = [
      ...(contacts ?? []),
      ...list.map(contact => ({
        association_type: 'contact',
        contact
      }))
    ]

    mutation.mutate({
      associations
    })
  }

  return (
    <>
      {showContactsList ? (
        <ContactsList onChange={onChangeContact} />
      ) : (
        <>
          {contacts?.map(({ contact }) => (
            <MenuItem key={contact!.id}>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <div>{contact!.display_name}</div>
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
            <Typography variant="subtitle1" color="primary">
              Add Client
            </Typography>
          </MenuItem>
        </>
      )}
    </>
  )
}
