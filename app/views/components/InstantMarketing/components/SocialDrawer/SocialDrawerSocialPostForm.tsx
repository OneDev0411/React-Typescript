import { useRef } from 'react'

import { useActiveBrandId } from '@app/hooks/brand'
import { useCreateSocialPost } from '@app/models/social-posts'
import { convertDateToTimestamp } from '@app/utils/date-utils'

import SocialPostForm, {
  SocialPostFormProps,
  FormValues
} from '../SocialPostForm'

import SocialDrawerSocialPostFormFooter from './SocialDrawerSocialPostFormFooter'

export interface SocialDrawerSocialPostFormProps
  extends Pick<SocialPostFormProps, 'initialValues'> {
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
  onPostSent,
  initialValues
}: SocialDrawerSocialPostFormProps) {
  const isScheduledRef = useRef<boolean>(false)

  const { mutateAsync } = useCreateSocialPost({
    notify: {
      onSuccess: () =>
        `The Instagram post has been ${
          isScheduledRef.current ? 'scheduled' : 'sent'
        }`,
      onError: error => {
        if (error.response?.body.code === 'ResourceNotFound') {
          return 'This account has been disconnected. Please try with another account or contact support for more information.'
        }

        return 'Something went wrong. Please contact support for more information.'
      }
    },
    onSuccess: () => {
      if (isScheduledRef.current) {
        onPostScheduled?.()
      } else {
        onPostSent?.()
      }
    }
  })
  const activeBrandId = useActiveBrandId()

  const handleSubmit = async (values: FormValues) => {
    if (!instance || !values.facebookPage) {
      return
    }

    isScheduledRef.current = !!values.dueAt

    try {
      await mutateAsync({
        ...values,
        facebookPage: values.facebookPage.id,
        due_at: convertDateToTimestamp(values.dueAt ?? new Date()),
        templateInstance: instance.id,
        brand: activeBrandId
      })
    } catch (error) {
      if (error?.response.body.code === 'ResourceNotFound') {
        return {
          facebookPage: 'The selected account has been disconnected.'
        }
      }
    }
  }

  return (
    <SocialPostForm
      className={className}
      onSubmit={handleSubmit}
      formId={formId}
      initialValues={initialValues}
    >
      <SocialDrawerSocialPostFormFooter formId={formId} />
    </SocialPostForm>
  )
}

export default SocialDrawerSocialPostForm
