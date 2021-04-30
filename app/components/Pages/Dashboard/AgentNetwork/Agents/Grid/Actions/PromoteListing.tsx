import React, { useState } from 'react'

import { mdiBullhornOutline } from '@mdi/js'

import { convertToTemplate } from 'utils/marketing-center/helpers'

import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import MarketingTemplateAndTemplateInstancePickerModal from 'components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePickerModal'
import { GridActionButton } from 'components/Grid/Table/features/Actions/Button'

import { ListingWithProposedAgent } from '../../types'

const MEDIUMS: IMarketingTemplateMedium[] = ['Email']
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
  const [selectedTemplate, setSelectedTemplate] = useState<
    Nullable<IBrandMarketingTemplate>
  >(null)

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
          mediums={MEDIUMS}
          onSelect={handleSelectTemplate}
          onClose={handleCloseTemplatePickerModal}
        />
      )}
      {selectedTemplate && (
        <SendMlsListingCard
          hasExternalTrigger
          isTriggered
          isTemplatesColumnHiddenDefault={false}
          mediums={MEDIUMS}
          types={TEMPLATE_TYPES}
          listing={listing}
          selectedTemplate={selectedTemplate}
          selectedRows={agents}
          handleTrigger={handleCloseMarketingEditor}
        />
      )}
    </>
  )
}
