import { Button, Typography, makeStyles } from '@material-ui/core'

import { useUpdateSuperCampaignTags } from '@app/models/super-campaign'
import SuperCampaignDisplayTags from '@app/views/components/SuperCampaignDisplayTags'
import SuperCampaignTagsPopover from '@app/views/components/SuperCampaignTagsPopover'

import { isSuperCampaignReadOnly } from '../../helpers'
import { useSuperCampaign } from '../SuperCampaignProvider'

const useStyles = makeStyles(
  {
    edit: { minWidth: 0 }
  },
  { name: 'SuperCampaignEligibleCardTags' }
)

function SuperCampaignEligibleCardTags() {
  const classes = useStyles()

  const superCampaign = useSuperCampaign()

  const { isLoading, mutateAsync } = useUpdateSuperCampaignTags()

  const isReadOnly = isSuperCampaignReadOnly(superCampaign)

  const handleTagsChange = async (tags: string[]) => {
    await mutateAsync({ superCampaignId: superCampaign.id, tags })
  }

  return (
    <Typography variant="body2" component="div">
      <SuperCampaignDisplayTags
        tags={superCampaign.tags ?? []}
        chipVariant="default"
      />
      {!isReadOnly && (
        <SuperCampaignTagsPopover
          tags={superCampaign.tags ?? []}
          onTagsChange={handleTagsChange}
          anchorRenderer={onClick => (
            <Button
              onClick={onClick}
              color="primary"
              size="small"
              disabled={isLoading}
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
