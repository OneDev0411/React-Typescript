import React, { useState, ReactNode, MouseEvent } from 'react'

import { Button } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'

import getListing from 'models/listings/listing/get-listing'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickers/MarketingTemplatePickerModal'
import ListingFlow from 'components/InstantMarketing/adapters/SendMlsListingCard'
import { useListSelection } from 'components/ListSelection/use-list-selection'

interface Props {
  buttonRenderer?: (props: {
    onClick: (e: MouseEvent<HTMLElement>) => void
  }) => ReactNode
}

export function EmailAction({ buttonRenderer }: Props) {
  const { selections } = useListSelection()

  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)
  const [listings, setListings] = useState<IListing[]>([])
  const [template, setTemplate] = useState<Nullable<IBrandMarketingTemplate>>(
    null
  )

  const user = useSelector(selectUser)

  const handleSelectTemplate = async (template: IBrandMarketingTemplate) => {
    const listings = await Promise.all(
      selections.map(async (selection: IListing) => {
        return getListing(selection.id)
      })
    )

    setIsTemplatesModalOpen(false)
    setListings(listings)
    setTemplate(template)
  }
  const handleOpenTemplateModal = e => setIsTemplatesModalOpen(true)
  const handleClose = () => {
    setTemplate(null)
    setListings([])
  }

  return (
    <>
      {buttonRenderer ? (
        buttonRenderer({ onClick: handleOpenTemplateModal })
      ) : (
        <Button
          size="small"
          variant="outlined"
          onClick={handleOpenTemplateModal}
        >
          Email
        </Button>
      )}

      {isTemplatesModalOpen && (
        <MarketingTemplatePickerModal
          title="Select Template"
          user={user}
          mediums={['Email']}
          templateTypes={['Listings']}
          onSelect={handleSelectTemplate}
          onClose={() => setIsTemplatesModalOpen(false)}
        />
      )}

      {template && listings.length > 0 && (
        <ListingFlow
          isTriggered
          hasExternalTrigger
          isTemplatesColumnHiddenDefault={false}
          handleTrigger={handleClose}
          isMultiListing={listings.length > 1}
          listings={listings}
          selectedTemplate={template}
        />
      )}
    </>
  )
}
