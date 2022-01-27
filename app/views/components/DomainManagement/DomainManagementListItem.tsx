import { IconButton, Link, makeStyles, Typography } from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import { addNotification as notify } from 'components/notification'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import useAsync from 'hooks/use-async'
import deleteHostnameFromWebsite from 'models/website/delete-hostname-from-website'
import { generateWebsiteUrl, isWebsiteOnSubdomain } from 'utils/website'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      height: theme.spacing(5),
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create('background-color'),
      '&:hover': { backgroundColor: theme.palette.grey[100] },
      '&:hover $action': { opacity: 1 }
    },
    action: {
      opacity: 0,
      transition: theme.transitions.create('opacity'),
      marginLeft: theme.spacing(1),
      '& svg': {
        color: theme.palette.text.secondary,
        fontSize: 22
      }
    },
    inactive: {
      opacity: 0.3,
      pointerEvents: 'none'
    }
  }),
  { name: 'DomainManagementListItem' }
)

interface DomainManagementListItemProps {
  hostname: string
  websiteId: IWebsite['id']
  onDelete: (hostname: string) => void
}

function DomainManagementListItem({
  hostname,
  websiteId,
  onDelete
}: DomainManagementListItemProps) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { isLoading: isWorking, run } = useAsync()

  const handleDeleteHostname = (hostname: string) => {
    run(async () => {
      try {
        await deleteHostnameFromWebsite(websiteId, { hostname })
        onDelete(hostname)
        dispatch(
          notify({
            message: 'The domain deleted successfully',
            status: 'success'
          })
        )
      } catch (_: unknown) {
        dispatch(
          notify({
            message:
              'An error occurred on deleting the domain, please try again',
            status: 'error'
          })
        )
      }
    })
  }

  return (
    <li className={classes.root}>
      <Typography variant="body1" noWrap>
        <Link href={generateWebsiteUrl(hostname)} target="_blank">
          {hostname}
        </Link>
      </Typography>
      {!isWebsiteOnSubdomain(hostname) && (
        <IconButton
          className={classNames(classes.action, isWorking && classes.inactive)}
          size="small"
          color="inherit"
          onClick={() => handleDeleteHostname(hostname)}
          disabled={isWorking}
        >
          <SvgIcon path={mdiClose} />
        </IconButton>
      )}
    </li>
  )
}

export default DomainManagementListItem
