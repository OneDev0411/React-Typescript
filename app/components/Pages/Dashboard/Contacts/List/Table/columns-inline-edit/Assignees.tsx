import { useMemo } from 'react'

import { Theme, makeStyles } from '@material-ui/core'

import { normalizeContact } from '@app/models/contacts/helpers/normalize-contact'
import { noop } from '@app/utils/helpers'

import { AssigneesEditMode } from '../../../components/AssigneesEditMode'

import { InlineEditColumnsProps as AssigneesInlineEditProps } from './type'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '400px',
      height: '400px',
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
  callback = noop
}: AssigneesInlineEditProps) {
  const classes = useStyles()

  const normalizedContact = useMemo(() => {
    return normalizeContact(contact)
  }, [contact])

  const onChange = (newContact: IContact) => {
    callback(newContact.id)
  }

  return (
    <div className={classes.container}>
      <AssigneesEditMode contact={normalizedContact} onChange={onChange} />
    </div>
  )
}
