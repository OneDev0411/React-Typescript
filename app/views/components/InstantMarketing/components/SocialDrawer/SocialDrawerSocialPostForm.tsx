import { useSelector } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import { useCreateSocialPost } from '@app/models/social-posts'
import { selectActiveBrandId } from '@app/selectors/brand'

import SocialPostForm, { FormValues } from '../SocialPostForm'

import SocialDrawerSocialPostFormFooter from './SocialDrawerSocialPostFormFooter'

export interface SocialDrawerSocialPostFormProps {
  className?: string
  instance: Optional<IMarketingTemplateInstance | IBrandAsset>
  onPostScheduled?: () => void
  onPostSent?: () => void
}

const formId = 'schedule-instagram-post-form'

function SocialDrawerSocialPostForm({
  className,
  instance,
  onPostScheduled,
  onPostSent
}: SocialDrawerSocialPostFormProps) {
  const { mutateAsync } = useCreateSocialPost()
  const activeBrandId = useSelector(selectActiveBrandId)
  const notify = useNotify()

  const handleSubmit = async (values: FormValues) => {
    if (!instance || !values.facebookPage) {
      return
    }

    await mutateAsync({
      ...values,
      facebookPage: values.facebookPage.id,
      due_at: values.dueAt ?? new Date(),
      templateInstance: instance.id,
      brand: activeBrandId
    })

    const isScheduled = !!values.dueAt

    notify({
      status: 'success',
      message: `The Instagram post has been ${
        isScheduled ? 'scheduled' : 'sent'
      }`
    })

    if (isScheduled) {
      onPostScheduled?.()
    } else {
      onPostSent?.()
    }
  }

  return (
    <SocialPostForm
      className={className}
      onSubmit={handleSubmit}
      formId={formId}
    >
      <SocialDrawerSocialPostFormFooter formId={formId} />
    </SocialPostForm>
  )
}

export default SocialDrawerSocialPostForm
