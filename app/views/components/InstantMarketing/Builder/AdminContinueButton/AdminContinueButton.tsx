import { useState } from 'react'

import { Button, ButtonProps } from '@material-ui/core'

import AdminContinueDrawer from './AdminContinueDrawer'

interface AdminContinueButtonProps
  extends Omit<ButtonProps, 'variant' | 'color' | 'onClick' | 'children'> {
  onClick: () => void
  hasAddToMarketingCenter: boolean
}

function AdminContinueButton({
  onClick,
  hasAddToMarketingCenter,
  ...otherProps
}: AdminContinueButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)

  const closeDrawer = () => setIsOpen(false)

  const redirectToSuperCampaign = () => console.log('redirectToSuperCampaign') // TODO: implement this

  const addToMarketingCenter = () => console.log('addToMarketingCenter') // TODO: implement this

  return (
    <>
      <Button
        {...otherProps}
        variant="contained"
        color="primary"
        onClick={openDrawer}
      >
        Continue
      </Button>
      <AdminContinueDrawer
        open={isOpen}
        onClose={closeDrawer}
        onContinueClick={onClick}
        onSuperCampaignClick={redirectToSuperCampaign}
        onAddToMarketingCenterClick={addToMarketingCenter}
        hasAddToMarketingCenter={hasAddToMarketingCenter}
      />
    </>
  )
}

export default AdminContinueButton
