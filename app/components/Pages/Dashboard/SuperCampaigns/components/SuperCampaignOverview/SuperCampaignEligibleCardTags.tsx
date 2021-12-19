import { makeStyles } from '@material-ui/core'

import { BaseTagSelector } from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

import { isSuperCampaignReadOnly } from '../../helpers'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import { useUpdateSuperCampaignTags } from './use-update-super-campaign-tags'

const useStyles = makeStyles(
  {
    readOnly: { pointerEvents: 'none' },
    chipDeleteIcon: { display: 'none' }
  },
  { name: 'SuperCampaignEligibleCardTags' }
)

interface SuperCampaignEligibleCardTagsProps {
  className?: string
}

function SuperCampaignEligibleCardTags({
  className
}: SuperCampaignEligibleCardTagsProps) {
  const classes = useStyles()

  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()

  const { isSaving, updateSuperCampaignTags } = useUpdateSuperCampaignTags(
    superCampaign,
    setSuperCampaign
  )

  const isReadOnly = isSuperCampaignReadOnly(superCampaign)

  const stringValue =
    superCampaign.tags?.map(tag => ({ title: tag, value: tag })) ?? []

  const handleChange = (tags: SelectorOption[]) =>
    updateSuperCampaignTags(tags.map(tag => tag.title))

  return (
    <BaseTagSelector
      className={isReadOnly ? classes.readOnly : undefined}
      value={stringValue}
      onChange={handleChange}
      chipProps={{
        size: 'small',
        classes: {
          deleteIcon: isReadOnly ? classes.chipDeleteIcon : undefined
        }
      }}
      textFieldProps={{
        placeholder: !isReadOnly ? 'Search or create tags...' : undefined
      }}
      disabled={isSaving}
    />
  )
}

export default SuperCampaignEligibleCardTags
