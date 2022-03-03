import { Button, ButtonProps, CircularProgress } from '@material-ui/core'

import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { createSuperCampaign } from '@app/models/super-campaign'
import { goTo } from '@app/utils/go-to'
import {
  createTemplateInstance,
  TemplateInstanceInputData
} from 'models/instant-marketing/create-template-instance'

interface CreateSuperCampaignButtonProps
  extends Omit<
    ButtonProps,
    'variant' | 'color' | 'onClick' | 'children' | 'startIcon'
  > {
  template: Nullable<IMarketingTemplate>
  templateInstanceData: Omit<TemplateInstanceInputData, 'html'>
  getTemplateMarkup: () => string
}

function CreateSuperCampaignButton({
  disabled,
  template,
  getTemplateMarkup,
  templateInstanceData,
  ...otherProps
}: CreateSuperCampaignButtonProps) {
  const { isRunning: isCreatingSuperCampaign, runActionThenNotify } =
    useRunActionThenNotify()

  const createSuperCampaignAndRedirect = () => {
    if (!template) {
      return
    }

    const html = getTemplateMarkup()

    if (!html) {
      return
    }

    runActionThenNotify(
      async () => {
        const templateInstance = await createTemplateInstance(template.id, {
          ...templateInstanceData,
          html
        })

        const superCampaign = await createSuperCampaign({
          subject: '',
          description: '',
          template_instance: templateInstance.id,
          due_at: null
        })

        goTo(
          `/dashboard/insights/super-campaign/${superCampaign.id}/detail?edit-drawer=open`
        )
      },
      'The campaign has been created',
      'Something went wrong while saving the template or creating a campaign. Please try again.'
    )
  }

  return (
    <>
      <Button
        {...otherProps}
        variant="contained"
        color="primary"
        onClick={createSuperCampaignAndRedirect}
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

export default CreateSuperCampaignButton
