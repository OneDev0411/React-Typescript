import { Box, MenuList, makeStyles } from '@material-ui/core'
import {
  mdiAccountOutline,
  mdiAccountGroupOutline,
  mdiNewspaperVariantMultipleOutline
} from '@mdi/js'

import OverlayDrawer, { OverlayDrawerProps } from 'components/OverlayDrawer'

import { EmailTemplatePurpose } from '../../types'

import EmailTemplatePurposeOption from './EmailTemplatePurposeOption'

const useStyles = makeStyles(
  theme => ({
    body: { padding: theme.spacing(3) },
    grey: { color: theme.palette.grey[600] }
  }),
  { name: 'EmailTemplatePurposeDrawer' }
)

export interface EmailTemplatePurposeDrawerProps
  extends Omit<OverlayDrawerProps, 'children'> {
  onPurposeSelect: (emailTemplatePurpose: EmailTemplatePurpose) => void
}

function EmailTemplatePurposeDrawer({
  onPurposeSelect,
  onClose,
  ...otherProps
}: EmailTemplatePurposeDrawerProps) {
  const classes = useStyles()

  const handleMenuItemClick = () => onClose({}, 'closeButtonClick')

  return (
    <OverlayDrawer {...otherProps} onClose={onClose}>
      <OverlayDrawer.Header
        title="What do you want to do?"
        closeButtonDisabled
      />
      <OverlayDrawer.Body className={classes.body}>
        <Box>
          <MenuList onClick={handleMenuItemClick} disablePadding>
            <EmailTemplatePurposeOption
              onClick={() => onPurposeSelect('ForMySelf')}
              icon={mdiAccountOutline}
              title="Create for myself"
              description="Only you will be able to edit or use this template."
            />
            <EmailTemplatePurposeOption
              onClick={() => onPurposeSelect('ForOtherAgents')}
              icon={mdiAccountGroupOutline}
              title="Create for other agents"
              description="Agents of your team will be able to edit or use this template."
            />
            <EmailTemplatePurposeOption
              onClick={() => onPurposeSelect('ForCampaigns')}
              icon={mdiNewspaperVariantMultipleOutline}
              title="Create for campaigns"
              description="You can send it on behalf of other agents. This template can be
              copied by agents of your team."
            />
          </MenuList>
        </Box>
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default EmailTemplatePurposeDrawer
