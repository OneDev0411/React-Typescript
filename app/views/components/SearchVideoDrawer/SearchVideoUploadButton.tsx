import { makeStyles, Typography } from '@material-ui/core'
import { mdiArrowUpCircle } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    container: {
      margin: theme.spacing(1, 1, 1, 1),
      height: `calc(50% - ${theme.spacing(1)}px)`,
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: theme.spacing(0.5),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      cursor: 'pointer',
      '&$disabled': {
        cursor: 'not-allowed'
      },
      '&:hover:not($disabled)': {
        border: `1px dashed ${theme.palette.grey[400]}`,
        '& $icon': {
          color: theme.palette.grey[500]
        },
        '& $text': {
          color: theme.palette.grey[700]
        }
      }
    },
    disabled: { opacity: 0.5, backgroundColor: theme.palette.grey[100] },
    icon: { color: theme.palette.grey[400] },
    text: { color: theme.palette.grey[600] }
  }),
  { name: 'SearchVideoUploadButton' }
)

interface Props {
  onClick: () => void
  disabled?: boolean
}

function SearchVideoUploadButton({ onClick, disabled = false }: Props) {
  const classes = useStyles()

  return (
    <div
      className={cn(classes.container, disabled && classes.disabled)}
      onClick={!disabled ? onClick : undefined}
    >
      <SvgIcon
        className={classes.icon}
        size={muiIconSizes.xlarge}
        path={mdiArrowUpCircle}
      />
      <Typography className={classes.text} variant="button">
        Click here to upload
      </Typography>
    </div>
  )
}

export default SearchVideoUploadButton
