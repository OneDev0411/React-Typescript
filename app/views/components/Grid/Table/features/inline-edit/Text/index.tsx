import { useState, useEffect, MouseEvent } from 'react'

import { makeStyles, TextField, Button, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: ({ rowSize }: { rowSize: number }) => ({
      padding: 0,
      height: `${rowSize - 1}px`,
      minWidth: '115%',
      background: theme.palette.background.paper,
      boxShadow:
        '0px 0.3px 0.5px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.2)',
      borderRadius: theme.shape.borderRadius
    }),
    textField: {
      ...theme.typography.body2,
      paddingLeft: theme.spacing(0.25),
      letterSpacing: 0.15
    }
  }),
  {
    name: 'Table-TextInlineEdit'
  }
)

interface Props {
  value: number | string
  isSaving?: boolean
  rowSize?: number
  onSave: (e: MouseEvent<HTMLButtonElement>, value: number | string) => void
}

export function TextInlineEdit({
  value,
  isSaving,
  onSave,
  rowSize = 40
}: Props) {
  const [fieldValue, setFieldValue] = useState(value)
  const classes = useStyles({ rowSize })

  useEffect(() => {
    setFieldValue(value)
  }, [value])

  return (
    <div className={classes.root}>
      <TextField
        value={fieldValue}
        size="small"
        variant="outlined"
        fullWidth
        onChange={e => setFieldValue(e.target.value)}
        style={{
          flexDirection: 'row',
          height: '100%'
        }}
        InputProps={{
          className: classes.textField,
          endAdornment: (
            <Button
              size="small"
              disabled={isSaving}
              onClick={e => onSave(e, value)}
            >
              Save
            </Button>
          )
        }}
      />
    </div>
  )
}
