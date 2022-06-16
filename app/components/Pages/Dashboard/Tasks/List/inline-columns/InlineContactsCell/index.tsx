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

import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

interface Props {
  contactAssociations?: ICRMTaskAssociation<'contact'>[]
  closeHandler: () => void
}

export function InlineContactsCell({
  contactAssociations,
  closeHandler
}: Props) {
  const [contacts /* setContacts */] = useState(contactAssociations)
  const [showContactsList, setShowContactsList] = useState(false)
  const theme = useTheme<Theme>()

  return (
    <>
      {showContactsList && <div>++</div>}

      {!showContactsList && (
        <>
          {contacts.map(({ contact }) => (
            <MenuItem key={contact?.id}>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <div>{contact?.display_name}</div>
                <div>
                  <IconButton
                    size="small"
                    onClick={() =>
                      window.open(`/dashboard/contacts/${contact?.id}`)
                    }
                  >
                    <SvgIcon
                      path={mdiOpenInNew}
                      size={muiIconSizes.small}
                      color={theme.palette.action.disabled}
                    />
                  </IconButton>

                  <IconButton size="small">
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
