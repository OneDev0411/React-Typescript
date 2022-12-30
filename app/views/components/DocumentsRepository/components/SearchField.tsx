import { InputAdornment, makeStyles, TextField, Theme } from '@material-ui/core'
import { mdiMagnify } from '@mdi/js'

import { SvgIcon } from '../../SvgIcons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    input: {
      backgroundColor: '#fff'
    },
    startAdornmentIcon: {
      color: theme.palette.action.active
    }
  }),
  {
    name: 'DocumentRepositorySearchField'
  }
)

export function SearchField() {
  const classes = useStyles()

  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      placeholder="Search in all forms..."
      InputProps={{
        className: classes.input,
        startAdornment: (
          <InputAdornment position="start">
            <SvgIcon path={mdiMagnify} className={classes.startAdornmentIcon} />
          </InputAdornment>
        )
      }}
    />
  )
}
