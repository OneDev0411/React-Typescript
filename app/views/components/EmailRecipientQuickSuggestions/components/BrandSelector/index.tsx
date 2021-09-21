import { BrandSelectorDrawer } from '@app/views/components/BrandSelectorDrawer'

import { Brand } from './components/Brand'

interface Props {
  currentRecipients?: IDenormalizedEmailRecipientInput[]
  onSelect: (
    recipient: IDenormalizedEmailRecipientInput,
    sendType: IEmailRecipientSendType | undefined
  ) => void
}

export function BrandSelector({ onSelect, currentRecipients = [] }: Props) {
  const handleOnClickBrand = (brand: IBrand, onClose: () => void) => {
    const recipient: IDenormalizedEmailRecipientBrandInput = {
      recipient_type: 'Brand',
      brand
    }

    onSelect(recipient, 'BCC')
    onClose()
  }

  const renderBrandNode = (brand, onClose) => {
    return (
      <Brand
        brand={brand}
        currentRecipients={currentRecipients}
        onClick={() => handleOnClickBrand(brand, onClose)}
      />
    )
  }

  return (
    <BrandSelectorDrawer
      defaultButtonProps={{ size: 'small' }}
      /*
        we set the drawer width to the 43rem manually bacause in our email drawer we set this
        value and base on shayan request we want the brand selector drawer cover the email drawer
      */
      drawerProps={{ width: '43rem' }}
      nodeRenderer={renderBrandNode}
    />
  )
}
