// import { useMemo } from 'react'

import { Button, Theme, makeStyles } from '@material-ui/core'

import { DateField } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/EditMode/Value/fields'

import { InlineEditColumnsProps as BirthdayInlineEditProps } from './type'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1.5, 1)
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
  const onChangeValue = value => {
    console.log('BirthdayInlineEdit', { value })
  }

  return (
    <div className={classes.container}>
      <DateField onChange={onChangeValue} />
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        size="small"
        className={classes.save}
      >
        Save
      </Button>
    </div>
  )
}
