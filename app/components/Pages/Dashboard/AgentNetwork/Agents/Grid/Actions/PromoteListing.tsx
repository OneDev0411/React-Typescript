import { useState } from 'react'

import { mdiBullhornOutline } from '@mdi/js'

import { GridActionButton } from '@app/views/components/Grid/Table/features/Actions/Button'
import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import MarketingTemplateAndTemplateInstancePickerModal from 'components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePickerModal'
import { convertToTemplate } from 'utils/marketing-center/helpers'

import { AGENT_NETWORK_EMAIL_CAMPAIGN_TAG } from '../../../constants'
import { ListingWithProposedAgent } from '../../types'

const MEDIUM: IMarketingTemplateMedium = 'Email'
const TEMPLATE_TYPES: IMarketingTemplateType[] = [
  'OpenHouse',
  'JustSold',
  'ComingSoon',
  'JustListed',
  'PriceImprovement'
]

interface Props {
  user: IUser
  listing: ListingWithProposedAgent
  agents: IAgent[]
}

export default function PromoteListing({ user, listing, agents }: Props) {
  const [isPromoteClicked, setIsPromoteClicked] = useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] =
    useState<Nullable<IBrandMarketingTemplate>>(null)

  function handlePromoteClick() {
    setIsPromoteClicked(true)
  }

  function handleCloseTemplatePickerModal() {
    setIsPromoteClicked(false)
  }

  function handleSelectTemplate(
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) {
    handleCloseTemplatePickerModal()

    if (template.type === 'template_instance') {
      setSelectedTemplate(convertToTemplate(template))

      return
    }

    setSelectedTemplate(template)
  }

  function handleCloseMarketingEditor() {
    setSelectedTemplate(null)
  }

  return (
    <>
      <GridActionButton
        label="eBlast"
        icon={mdiBullhornOutline}
        onClick={handlePromoteClick}
      />
      {isPromoteClicked && (
        <MarketingTemplateAndTemplateInstancePickerModal
          user={user}
          templateTypes={TEMPLATE_TYPES}
          mediums={[MEDIUM]}
          onSelect={handleSelectTemplate}
          onClose={handleCloseTemplatePickerModal}
        />
      )}
      {selectedTemplate && (
        <SendMlsListingCard
          hasExternalTrigger
          isTriggered
          isTemplatesColumnHiddenDefault={false}
          mediums={MEDIUM}
          types={TEMPLATE_TYPES}
          listing={listing}
          selectedTemplate={selectedTemplate}
          selectedRows={agents}
          tags={[AGENT_NETWORK_EMAIL_CAMPAIGN_TAG]}
          handleTrigger={handleCloseMarketingEditor}
        />
      )}
    </>
  )
}
