import { useState } from 'react'

import { Button, ButtonProps, CircularProgress } from '@material-ui/core'

import useNotify from '@app/hooks/use-notify'
import { goTo } from '@app/utils/go-to'
import {
  createTemplateInstance,
  TemplateInstanceInputData
} from 'models/instant-marketing/create-template-instance'

import AdminContinueDrawer from './AdminContinueDrawer'
import { useCreateSuperCampaign } from './use-create-super-campaign'

interface AdminContinueButtonProps
  extends Omit<
    ButtonProps,
    'variant' | 'color' | 'onClick' | 'children' | 'startIcon'
  > {
  onClick: () => void
  hasAddToMarketingCenter: boolean
  template: Nullable<IMarketingTemplate>
  templateInstanceData: Omit<TemplateInstanceInputData, 'html'>
  getTemplateMarkup: () => string
}

function AdminContinueButton({
  onClick,
  hasAddToMarketingCenter,
  disabled,
  template,
  getTemplateMarkup,
  templateInstanceData,
  ...otherProps
}: AdminContinueButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreatingSuperCampaign, setIsCreatingSuperCampaign] = useState(false)

  const notify = useNotify()

  const openDrawer = () => setIsOpen(true)

  const closeDrawer = () => setIsOpen(false)

  const { createSuperCampaign } = useCreateSuperCampaign()

  const createSuperCampaignAndRedirect = async () => {
    if (!template) {
      return
    }

    const html = getTemplateMarkup()

    setIsCreatingSuperCampaign(true)

    try {
      const templateInstance = await createTemplateInstance(template.id, {
        ...templateInstanceData,
        html
      })

      const superCampaign = await createSuperCampaign({
        subject: '',
        description: '',
        due_at: new Date().getTime(),
        template_instance: templateInstance.id
      })

      goTo(`/dashboard/super-campaigns/${superCampaign.id}/detail`)
    } catch (_) {
      notify({
        status: 'error',
        message:
          'Something went wrong while saving the template or creating a super campaign. Please try again.'
      })
    }

    setIsCreatingSuperCampaign(false)
  }

  const addToMarketingCenter = () => console.log('addToMarketingCenter') // TODO: implement this

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
        onAddToMarketingCenterClick={addToMarketingCenter}
        hasAddToMarketingCenter={hasAddToMarketingCenter}
      />
    </>
  )
}

export default AdminContinueButton
