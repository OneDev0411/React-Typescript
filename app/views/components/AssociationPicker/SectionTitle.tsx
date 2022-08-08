import { makeStyles, Theme, Typography } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      color: theme.palette.grey['600'],
      margin: theme.spacing(1, 2),
      fontWeight: 600
    }
  }),
  {
    name: 'DealPropertyPicker-SectionTitle'
  }
)

interface Props {
  text: string
}

export function SectionTitle({ text }: Props) {
  const classes = useStyles()

  return <Typography className={classes.root}>{text}</Typography>
}
