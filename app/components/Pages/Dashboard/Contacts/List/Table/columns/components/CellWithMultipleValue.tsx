import { Typography, Chip, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  () => ({
    container: {
      maxWidth: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      alignItems: 'center',
      alignContent: 'space-between'
    },
    label: {
      flexGrow: 1
    }
  }),
  { name: 'CellWithMultipleValue' }
)

interface Props {
  label: string
  info?: string
}

export function CellWithMultipleValue({ label, info }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Typography variant="inherit" noWrap className={classes.label}>
        {label}
      </Typography>
      {info && <Chip variant="outlined" size="small" label={info} />}
    </div>
  )
}
