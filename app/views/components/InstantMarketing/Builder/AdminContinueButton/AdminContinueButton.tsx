import { Button, ButtonProps, CircularProgress } from '@material-ui/core'

import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { goTo } from '@app/utils/go-to'
import {
  createTemplateInstance,
  TemplateInstanceInputData
} from 'models/instant-marketing/create-template-instance'

import { EmailTemplatePurpose } from '../../types'

import { useCreateSuperCampaign } from './use-create-super-campaign'

interface AdminContinueButtonProps
  extends Omit<
    ButtonProps,
    'variant' | 'color' | 'onClick' | 'children' | 'startIcon'
  > {
  onClick: () => void
  template: Nullable<IMarketingTemplate>
  templateInstanceData: Omit<TemplateInstanceInputData, 'html'>
  getTemplateMarkup: () => string
  emailTemplatePurpose: Optional<EmailTemplatePurpose>
}

function AdminContinueButton({
  onClick,
  disabled,
  template,
  getTemplateMarkup,
  templateInstanceData,
  emailTemplatePurpose,
  ...otherProps
}: AdminContinueButtonProps) {
  const { isRunning: isCreatingSuperCampaign, runActionThenNotify } =
    useRunActionThenNotify()

  const { createSuperCampaign } = useCreateSuperCampaign()

  const createSuperCampaignAndRedirect = () =>
    runActionThenNotify(
      async () => {
        if (!template) {
          return
        }

        const html = getTemplateMarkup()
        const templateInstance = await createTemplateInstance(template.id, {
          ...templateInstanceData,
          html
        })

        const superCampaign = await createSuperCampaign({
          subject: '',
          description: '',
          template_instance: templateInstance.id
        })

        goTo(
          `/dashboard/insights/super-campaign/${superCampaign.id}/detail?edit-drawer=open`
        )
      },
      'The campaign has been created',
      'Something went wrong while saving the template or creating a campaign. Please try again.'
    )

  const handleClick = () => {
    switch (emailTemplatePurpose) {
      case 'ForMySelf':
        onClick()
        break
      case 'ForCampaigns':
        createSuperCampaignAndRedirect()
        break
      default:
    }
  }

  return (
    <>
      <Button
        {...otherProps}
        variant="contained"
        color="primary"
        onClick={handleClick}
        disabled={disabled || isCreatingSuperCampaign}
        startIcon={
          isCreatingSuperCampaign && (
            <CircularProgress color="inherit" size={20} />
          )
        }
      >
        Continue
      </Button>
    </>
  )
}

export default AdminContinueButton
