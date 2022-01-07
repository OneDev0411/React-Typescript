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
              title="Create for myself"
              description="Only you will be able to edit or use this template."
            />
            {builderActions.shouldShowSaveAsTemplateButton && (
              <MarketingTemplatePurposeOption
                onClick={() => onPurposeSelect('ForOtherAgents')}
                icon={mdiAccountGroupOutline}
                title="Create for other agents"
                description="Agents of your team will be able to edit or use this template."
              />
            )}
            {builderActions.shouldShowCreateSuperCampaignButton && (
              <MarketingTemplatePurposeOption
                onClick={() => onPurposeSelect('ForCampaigns')}
                icon={mdiNewspaperVariantMultipleOutline}
                title="Create for campaigns"
                description="You can send it on behalf of other agents. This template can be
                copied by agents of your team."
              />
            )}
          </MenuList>
        </Box>
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default MarketingTemplatePurposeDrawer
