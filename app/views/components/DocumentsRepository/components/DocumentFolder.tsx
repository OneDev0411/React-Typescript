import { Box, Checkbox, makeStyles, Theme, Typography } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      border: `1px solid ${theme.palette.grey[200]}`
    },
    header: {
      backgroundColor: theme.palette.grey[50],
      padding: theme.spacing(2, 2)
    }
  }),
  {
    name: 'DocumentRepositoryDocumentFolder'
  }
)

interface Props {
  title: string
  children: React.ReactNode
}

export function DocumentFolder({ title, children }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Box display="flex" alignItems="center" className={classes.header}>
        <Box mr={1}>
          <Checkbox />
        </Box>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>

      <Box>{children}</Box>
    </Box>
  )
}
