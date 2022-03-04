import { Box, MenuList, makeStyles } from '@material-ui/core'
import {
  mdiAccountOutline,
  mdiAccountGroupOutline,
  mdiNewspaperVariantMultipleOutline
} from '@mdi/js'

import OverlayDrawer, { OverlayDrawerProps } from 'components/OverlayDrawer'

import { UseMarketingBuilderActions } from '../../hooks/use-marketing-builder-actions'

import MarketingTemplatePurposeOption from './MarketingTemplatePurposeOption'

const useStyles = makeStyles(
  theme => ({
    body: { padding: theme.spacing(3) },
    grey: { color: theme.palette.grey[600] }
  }),
  { name: 'MarketingTemplatePurposeDrawer' }
)

export interface MarketingTemplatePurposeDrawerProps
  extends Omit<OverlayDrawerProps, 'children'> {
  builderActions: UseMarketingBuilderActions
  onPurposeSelect: (emailTemplatePurpose: IMarketingTemplatePurpose) => void
}

function MarketingTemplatePurposeDrawer({
  onPurposeSelect,
  onClose,
  builderActions,
  ...otherProps
}: MarketingTemplatePurposeDrawerProps) {
  const classes = useStyles()

  return (
    <OverlayDrawer {...otherProps} onClose={onClose}>
      <OverlayDrawer.Header title="What do you want to do?" />
      <OverlayDrawer.Body className={classes.body}>
        <Box>
          <MenuList disablePadding>
            <MarketingTemplatePurposeOption
              onClick={() => onPurposeSelect('ForMySelf')}
              icon={mdiAccountOutline}
              title="Schedule or Send"
              // TODO: Display a proper description when the new team switcher has merged and the current user is an admin that
              // sees the option on behalf of another person.
              description="Create to schedule or send. Best when sending or sharing on behalf of yourself."
            />
            {builderActions.shouldShowSaveAsTemplateButton && (
              <MarketingTemplatePurposeOption
                onClick={() => onPurposeSelect('ForOtherAgents')}
                icon={mdiAccountGroupOutline}
                title="Add to Marketing Center"
                description="Create a template and select users to add it to their Marketing Center so they can edit or use it."
              />
            )}
            {builderActions.shouldShowCreateSuperCampaignButton && (
              <MarketingTemplatePurposeOption
                onClick={() => onPurposeSelect('ForCampaigns')}
                icon={mdiNewspaperVariantMultipleOutline}
                title="Create a Campaign"
                description="Create a Campaign to schedule or send on behalf of other users. Best for when you’d like to schedule or send on behalf of more than one user."
              />
            )}
          </MenuList>
        </Box>
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default MarketingTemplatePurposeDrawer
