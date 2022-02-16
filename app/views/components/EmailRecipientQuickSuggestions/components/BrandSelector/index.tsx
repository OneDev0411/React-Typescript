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
}

export function BrandSelector({ onSelect, currentRecipients = [] }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const hanldeOpenDrawer = () => setIsOpen(true)
  const hanldeCloseDrawer = () => setIsOpen(false)

  const handleOnClickBrand = (brand: IBrand) => {
    const recipient: IDenormalizedEmailRecipientBrandInput = {
      recipient_type: 'Brand',
      brand
    }

    onSelect(recipient, 'BCC')
    hanldeCloseDrawer()
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
      <Button size="small" onClick={hanldeOpenDrawer}>
        Our Agents
      </Button>
      {isOpen && (
        <UserRootBrandSelectorDrawer
          open
          /*
          we set the drawer width to the 43rem manually bacause in our email drawer we set this
          value and base on shayan request we want the brand selector drawer cover the email drawer
          */
          width="43rem"
          onClose={hanldeCloseDrawer}
          brandSelectorProps={{
            nodeRenderer: renderBrandNode
          }}
        />
      )}
    </>
  )
}
