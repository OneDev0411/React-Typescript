import { Box, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      backgroundColor: '#fff',
      borderLeft: `1px solid ${theme.palette.grey['200']}`,
      borderTop: `1px solid ${theme.palette.grey['200']}`
    }
  }),
  {
    name: 'DocumentRepositoryDocumentsList'
  }
)

export function DocumentsList() {
  const classes = useStyles()

  return (
    <Box className={classes.root} minHeight="400px">
      ++++++
    </Box>
  )
}
