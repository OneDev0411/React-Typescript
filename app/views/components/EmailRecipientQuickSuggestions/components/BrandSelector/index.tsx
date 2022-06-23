import { useCallback, useState } from 'react'

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

  // Filter out brands that don't have any sub-brands and also have no team members
  // https://gitlab.com/rechat/web/-/issues/6554
  const filterDeactivatedBrands = useCallback((team: IBrand) => {
    return !!team.children?.length || team.member_count > 0
  }, [])

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
            filterFn: filterDeactivatedBrands
          }}
        />
      )}
    </>
  )
}
