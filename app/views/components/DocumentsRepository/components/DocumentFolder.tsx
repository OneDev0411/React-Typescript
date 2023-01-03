import { Box, Checkbox, makeStyles, Theme, Typography } from '@material-ui/core'
import pluralize from 'pluralize'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      border: `1px solid ${theme.palette.grey[200]}`
    },
    header: {
      backgroundColor: theme.palette.grey[50],
      padding: theme.spacing(1.5, 2),
      borderBottom: `1px solid ${theme.palette.grey[200]}`
    }
  }),
  {
    name: 'DocumentRepositoryDocumentFolder'
  }
)

interface Props {
  title: string
  totalCount: number
  children: React.ReactNode
}

export function DocumentFolder({ title, totalCount, children }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.root} mb={2}>
      <Box display="flex" alignItems="center" className={classes.header}>
        <Box mr={1}>
          <Checkbox color="primary" indeterminate={false} />
        </Box>
        <Typography variant="subtitle1">{title}</Typography>
        <Box ml={1}>
          <Typography variant="body2">
            ({pluralize('Form', totalCount, true)})
          </Typography>
        </Box>
      </Box>

      <Box>{children}</Box>
    </Box>
  )
}
