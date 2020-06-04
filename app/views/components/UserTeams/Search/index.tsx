import React from 'react'
import { TextField, createStyles, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex'
    }
  })
)

interface Props {
  onChange: (query: string) => void
}

export default function Search({ onChange }: Props) {
  const classes = useStyles()

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    onChange(ev.target.value)
  }

  return (
    <div className={classes.container}>
      <TextField
        fullWidth
        margin="normal"
        autoComplete="off"
        label="Search Teams And Members"
        type="search"
        variant="outlined"
        onChange={handleChange}
        InputLabelProps={{
          shrink: true
        }}
      />
    </div>
  )
}
