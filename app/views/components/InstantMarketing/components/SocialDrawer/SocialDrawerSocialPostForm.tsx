import { useSelector } from 'react-redux'

import { useCreateSocialPost } from '@app/models/social-posts'
import { selectActiveBrandId } from '@app/selectors/brand'

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
  const { mutateAsync } = useCreateSocialPost()
  const activeBrandId = useSelector(selectActiveBrandId)

  const handleSubmit = async (values: FormValues) =>
    mutateAsync({
      ...values,
      facebookPage: values.facebookPage!.id, // TODO: remove this
      due_at: values.dueAt ?? new Date(),
      templateInstance: instance!.id,
      brand: activeBrandId
    })

  // {
  //   // TODO: call the update model
  //   console.log('values', values)
  //   await new Promise(resolve => setTimeout(resolve, 2500))
  // }

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
