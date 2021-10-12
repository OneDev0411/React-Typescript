import { Box, MenuList, Typography, makeStyles } from '@material-ui/core'
import {
  mdiEmailOutline,
  mdiAccountGroupOutline,
  mdiNewspaperPlus
} from '@mdi/js'

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
  onAddToMarketingCenterClick: () => void
  hasAddToMarketingCenter: boolean
}

function AdminContinueDrawer({
  onContinueClick,
  onSuperCampaignClick,
  onAddToMarketingCenterClick,
  hasAddToMarketingCenter,
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
            {hasAddToMarketingCenter && (
              <AdminContinueItem
                onClick={onAddToMarketingCenterClick}
                icon={mdiNewspaperPlus}
              >
                <Typography variant="body1">Add to Marketing Center</Typography>
                <Typography variant="body2" className={classes.grey}>
                  Add this template to any offices or team's library.
                </Typography>
              </AdminContinueItem>
            )}
          </MenuList>
        </Box>
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default AdminContinueDrawer
