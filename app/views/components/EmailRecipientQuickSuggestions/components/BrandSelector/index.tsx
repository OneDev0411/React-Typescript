import { useState } from 'react'

import { Button } from '@material-ui/core'

import {
  NodeRenderer,
  UserRootBrandSelectorDrawer
} from '@app/views/components/BrandSelector'

import { Brand } from './components/Brand'

interface Props {
  currentRecipients?: IDenormalizedEmailRecipientInput[]
  onSelect: (
    recipient: IDenormalizedEmailRecipientInput,
    sendType: IEmailRecipientSendType | undefined
  ) => void
  filterFn?: (team: IBrand) => boolean
}

export function BrandSelector({
  onSelect,
  currentRecipients = [],
  filterFn
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpenDrawer = () => setIsOpen(true)
  const handleCloseDrawer = () => setIsOpen(false)

  const handleOnClickBrand = (brand: IBrand) => {
    const recipient: IDenormalizedEmailRecipientBrandInput = {
      recipient_type: 'Brand',
      brand
    }

    onSelect(recipient, 'BCC')
    handleCloseDrawer()
  }

  const renderBrandNode = ({ brand }: NodeRenderer) => {
    return (
      <Brand
        brand={brand}
        currentRecipients={currentRecipients}
        onClick={() => handleOnClickBrand(brand)}
      />
    )
  }

  return (
    <>
      <Button size="small" onClick={handleOpenDrawer}>
        Our Agents
      </Button>
      {isOpen && (
        <UserRootBrandSelectorDrawer
          open
          /*
          we set the drawer width to the 43rem manually because in our email drawer we set this
          value and base on Shayan request we want the brand selector drawer cover the email drawer
          */
          width="43rem"
          onClose={handleCloseDrawer}
          brandSelectorProps={{
            nodeRenderer: renderBrandNode,
            filterFn
          }}
        />
      )}
    </>
  )
}
