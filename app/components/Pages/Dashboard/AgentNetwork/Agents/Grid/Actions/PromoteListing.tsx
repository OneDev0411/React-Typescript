import React, { useState } from 'react'
import { Button } from '@material-ui/core'

import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickerModal'

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

  function handleSelectTemplate(template: IBrandMarketingTemplate) {
    handleCloseTemplatePickerModal()
    setSelectedTemplate(template)
  }

  function handleCloseMarketingEditor() {
    console.log('CLOSING MC')
    setSelectedTemplate(null)
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handlePromoteClick}>
        Promote Listing
      </Button>
      {isPromoteClicked && (
        <MarketingTemplatePickerModal
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
