import { makeStyles } from '@material-ui/core'

import { BaseTagSelector } from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'
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

  const isSuperCampaignReadOnly = useIsSuperCampaignReadOnly(superCampaign)

  const stringValue =
    superCampaign.tags?.map(tag => ({ title: tag, value: tag })) ?? []

  const handleChange = (tags: SelectorOption[]) =>
    updateSuperCampaignTags(tags.map(tag => tag.title))

  return (
    <BaseTagSelector
      className={isSuperCampaignReadOnly ? classes.readOnly : undefined}
      value={stringValue}
      onChange={handleChange}
      chipProps={{
        size: 'small',
        classes: {
          deleteIcon: isSuperCampaignReadOnly
            ? classes.chipDeleteIcon
            : undefined
        }
      }}
      textFieldProps={params => ({
        ...params,
        placeholder: !isSuperCampaignReadOnly
          ? 'Search or create tags...'
          : undefined
      })}
      disabled={isSaving}
    />
  )
}

export default SuperCampaignEligibleCardTags
