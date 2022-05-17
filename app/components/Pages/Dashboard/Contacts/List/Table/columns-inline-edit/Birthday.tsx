import { useCallback, useState } from 'react'

import { Typography, Button, Theme, makeStyles } from '@material-ui/core'

import { DateField } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/EditMode/Value/fields'
import { convertDateToTimestamp } from '@app/utils/date-utils'
import {
  validateDateField,
  Values as DateFieldType
} from '@app/utils/validations/date-field'
import {
  getDateValues,
  parseDateValues
} from '@app/views/components/inline-editable-fields/InlineDateField/helpers'

import { useAttributeCell } from './AttributeCell/hooks/use-attribute-cell'
import { InlineEditColumnsProps as BirthdayInlineEditProps } from './type'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1.5, 1)
    },
    error: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1)
    },
    save: {
      marginTop: theme.spacing(1.5)
    }
  }),
  {
    name: 'BirthdayInlineEdit'
  }
)
export function BirthdayInlineEdit({
  contact,
  callback,
  close
}: BirthdayInlineEditProps) {
  const classes = useStyles()
  const updateContact = useCallback(() => {
    callback?.(contact.id)
  }, [callback, contact.id])

  const { list, create, update } = useAttributeCell(
    contact,
    'birthday',
    updateContact
  )
  const [birthday, setBirthday] = useState<number>(() =>
    contact.birthday ? convertDateToTimestamp(new Date(contact.birthday)) : 0
  )
  const [error, setError] = useState<string>('')
  const [isDirty, setIsDirty] = useState<boolean>(false)

  const onChangeValue = (value: DateFieldType) => {
    setIsDirty(true)

    if (error) {
      setError('')
    }

    setBirthday(parseDateValues(value) ?? 0)
  }

  const onSave = () => {
    if (!isDirty) {
      return
    }

    const validateError = validateDateField(getDateValues(birthday))

    if (validateError) {
      return setError(validateError)
    }

    if (!contact.birthday) {
      create({
        date: birthday,
        label: null
      })

      return close?.()
    }

    update(list[0].id, {
      date: birthday,
      label: null
    })

    return close?.()
  }

  return (
    <div className={classes.container}>
      <DateField onChange={onChangeValue} value={birthday} />
      {error && (
        <Typography
          noWrap
          variant="caption"
          color="error"
          className={classes.error}
        >
          {error}
        </Typography>
      )}
      <Button
        fullWidth
        disabled={!isDirty}
        variant="contained"
        color="secondary"
        size="small"
        className={classes.save}
        onClick={onSave}
      >
        Save
      </Button>
    </div>
  )
}
