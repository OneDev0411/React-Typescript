import { Box, MenuList, Typography, makeStyles } from '@material-ui/core'
import { mdiEmailOutline, mdiAccountGroupOutline } from '@mdi/js'

import OverlayDrawer, { OverlayDrawerProps } from 'components/OverlayDrawer'

import AdminContinueItem from './AdminContinueItem'

const useStyles = makeStyles(
  theme => ({
    body: { padding: theme.spacing(3) },
    grey: { color: theme.palette.grey[600] }
  }),
  { name: 'AdminContinueDrawer' }
)

interface AdminContinueDrawerProps
  extends Omit<OverlayDrawerProps, 'children'> {
  onContinueClick: () => void
  onSuperCampaignClick: () => void
}

function AdminContinueDrawer({
  onContinueClick,
  onSuperCampaignClick,
  onClose,
  ...otherProps
}: AdminContinueDrawerProps) {
  const classes = useStyles()

  const handleMenuItemClick = () => onClose({}, 'closeButtonClick')

  return (
    <OverlayDrawer {...otherProps} onClose={onClose}>
      <OverlayDrawer.Header title="What do you want to do next?" />
      <OverlayDrawer.Body className={classes.body}>
        <Box>
          <MenuList onClick={handleMenuItemClick} disablePadding>
            <AdminContinueItem onClick={onContinueClick} icon={mdiEmailOutline}>
              <Typography variant="body1" component="span">
                Send or Schedule Email on Behalf of
              </Typography>
              <Typography variant="subtitle1" component="span">
                {' '}
                Yourself
              </Typography>
            </AdminContinueItem>
            <AdminContinueItem
              onClick={onSuperCampaignClick}
              icon={mdiAccountGroupOutline}
            >
              <Typography variant="body1" component="span">
                Send or Schedule Email on Behalf of
              </Typography>
              <Typography variant="subtitle1" component="span">
                {' '}
                Others
              </Typography>
            </AdminContinueItem>
          </MenuList>
        </Box>
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default AdminContinueDrawer
