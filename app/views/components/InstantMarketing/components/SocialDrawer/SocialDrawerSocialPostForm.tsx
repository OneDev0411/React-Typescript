import { useRef } from 'react'

import { useSelector } from 'react-redux'

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
  const isScheduledRef = useRef<boolean>(false)

  const { mutateAsync } = useCreateSocialPost({
    notify: {
      onSuccess: () =>
        `The Instagram post has been ${
          isScheduledRef.current ? 'scheduled' : 'sent'
        }`,
      onError: 'Something went wrong. Please try again.'
    },
    onSuccess: () => {
      if (isScheduledRef.current) {
        onPostScheduled?.()
      } else {
        onPostSent?.()
      }
    }
  })
  const activeBrandId = useSelector(selectActiveBrandId)

  const handleSubmit = async (values: FormValues) => {
    if (!instance || !values.facebookPage) {
      return
    }

    isScheduledRef.current = !!values.dueAt

    await mutateAsync({
      ...values,
      facebookPage: values.facebookPage.id,
      due_at: values.dueAt ?? new Date(),
      templateInstance: instance.id,
      brand: activeBrandId
    })
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
