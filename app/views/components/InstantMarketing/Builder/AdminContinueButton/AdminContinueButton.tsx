import { useState } from 'react'

import { Button, ButtonProps, CircularProgress } from '@material-ui/core'

import { goTo } from '@app/utils/go-to'

import AdminContinueDrawer from './AdminContinueDrawer'
import { useCreateSuperCampaign } from './use-create-super-campaign'

interface AdminContinueButtonProps
  extends Omit<
    ButtonProps,
    'variant' | 'color' | 'onClick' | 'children' | 'startIcon'
  > {
  onClick: () => void
  templateId: UUID
}

function AdminContinueButton({
  onClick,
  disabled,
  templateId,
  ...otherProps
}: AdminContinueButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = () => setIsOpen(true)

  const closeDrawer = () => setIsOpen(false)

  const { isCreatingSuperCampaign, createSuperCampaign } =
    useCreateSuperCampaign()

  const createSuperCampaignAndRedirect = async () => {
    const superCampaign = await createSuperCampaign({
      subject: '',
      description: '',
      due_at: new Date(),
      recipients: [],
      template: templateId
    })

    goTo(`/dashboard/super-campaign/${superCampaign.id}`)
  }

  return (
    <>
      <Button
        {...otherProps}
        variant="contained"
        color="primary"
        onClick={openDrawer}
        disabled={disabled || isCreatingSuperCampaign}
        startIcon={
          isCreatingSuperCampaign && (
            <CircularProgress color="inherit" size={20} />
          )
        }
      >
        Continue
      </Button>
      <AdminContinueDrawer
        open={isOpen}
        onClose={closeDrawer}
        onContinueClick={onClick}
        onSuperCampaignClick={createSuperCampaignAndRedirect}
      />
    </>
  )
}

export default AdminContinueButton
