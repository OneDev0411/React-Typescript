import { useMemo } from 'react'

import { Theme, makeStyles, Typography } from '@material-ui/core'

import { useActiveBrand } from '@app/hooks/brand'
import { normalizeContact } from '@app/models/contacts/helpers/normalize-contact'
import { noop } from '@app/utils/helpers'

import { AssigneesEditMode } from '../../../components/AssigneesEditMode'

import { InlineEditColumnsProps as AssigneesInlineEditProps } from './type'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1),
      overflow: 'hidden'
    }
  }),
  {
    name: 'AssigneesInlineEdit'
  }
)
export function AssigneesInlineEdit({
  contact,
  callback = noop,
  close = noop
}: AssigneesInlineEditProps) {
  const classes = useStyles()
  const activeBrand = useActiveBrand()

  const normalizedContact = useMemo(() => {
    return normalizeContact(contact)
  }, [contact])

  const onSave = (newContact: IContact) => {
    callback(newContact.id)
  }

  return (
    <div className={classes.container}>
      {activeBrand.id === contact.brand ? (
        <AssigneesEditMode
          contact={normalizedContact}
          onSave={onSave}
          onClose={close}
        />
      ) : (
        <Typography variant="body2">
          You don't have the right access to edit
        </Typography>
      )}
    </div>
  )
}
