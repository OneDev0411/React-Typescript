import { Box, Chip, makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    status: {
      display: 'inline-block',
      marginRight: theme.spacing(1),
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      borderRadius: '100%',
      backgroundColor: theme.palette.grey['700'],
      '&.Active': {
        backgroundColor: theme.palette.success.main
      },
      '&.Inactive': {
        backgroundColor: theme.palette.grey[700]
      }
    }
  }),
  { name: 'StatusChip' }
)

interface Props {
  text: string
  status: string
}

export function StatusChip({ text, status }: Props) {
  const classes = useStyles()

  return (
    <Chip
      variant="outlined"
      size="small"
      label={
        <Box display="flex" alignItems="center">
          <span className={cn(classes.status, status)} />
          {text}
        </Box>
      }
    />
  )
}
