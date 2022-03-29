import { useSelector } from 'react-redux'

import { useCreateSocialPost } from '@app/models/social-posts'
import { selectActiveBrandId } from '@app/selectors/brand'
import { convertDateToTimestamp } from '@app/utils/date-utils'

import SocialPostForm, { FormValues } from '../SocialPostForm'

import SocialDrawerSocialPostFormFooter from './SocialDrawerSocialPostFormFooter'

interface SocialDrawerScheduleInstagramPostProps {
  className?: string
  instance: Optional<IMarketingTemplateInstance | IBrandAsset>
}

const formId = 'schedule-instagram-post-form'

function SocialDrawerScheduleInstagramPost({
  className,
  instance
}: SocialDrawerScheduleInstagramPostProps) {
  const { mutateAsync, data } = useCreateSocialPost()
  const activeBrandId = useSelector(selectActiveBrandId)

  const isCreated = !!data

  const handleSubmit = async (values: FormValues) => {
    if (!instance || !values.facebookPage) {
      return
    }

    await mutateAsync({
      ...values,
      facebookPage: values.facebookPage.id,
      due_at: convertDateToTimestamp(values.dueAt ?? new Date()),
      templateInstance: instance.id,
      brand: activeBrandId
    })
  }

  if (isCreated) {
    return (
      <div>
        In this case, the insights button will be rendered next to a success
        message
      </div>
    )
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

export default SocialDrawerScheduleInstagramPost
