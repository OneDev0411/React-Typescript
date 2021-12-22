import { Button, Typography, makeStyles } from '@material-ui/core'

import SuperCampaignDisplayTags from '@app/views/components/SuperCampaignDisplayTags'
import SuperCampaignTagsPopover from '@app/views/components/SuperCampaignTagsPopover'

import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import { useUpdateSuperCampaignTags } from './use-update-super-campaign-tags'

const useStyles = makeStyles(
  {
    edit: { minWidth: 0 }
  },
  { name: 'SuperCampaignEligibleCardTags' }
)

function SuperCampaignEligibleCardTags() {
  const classes = useStyles()

  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()

  const { isSaving, updateSuperCampaignTags } = useUpdateSuperCampaignTags(
    superCampaign,
    setSuperCampaign
  )

  const isReadOnly = useIsSuperCampaignReadOnly(superCampaign)

  return (
    <Typography variant="body2" component="div">
      <SuperCampaignDisplayTags
        tags={superCampaign.tags ?? []}
        visibleCount={Number.POSITIVE_INFINITY}
      />
      {!isReadOnly && (
        <SuperCampaignTagsPopover
          tags={superCampaign.tags ?? []}
          onTagsChange={updateSuperCampaignTags}
          anchorRenderer={onClick => (
            <Button
              onClick={onClick}
              color="primary"
              size="small"
              disabled={isSaving}
              className={classes.edit}
            >
              Edit
            </Button>
          )}
        />
      )}
    </Typography>
  )
}

export default SuperCampaignEligibleCardTags
