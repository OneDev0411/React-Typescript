import { useState } from 'react'

import { Button, ButtonProps } from '@material-ui/core'

import { convertTimestampToDate } from '@app/utils/date-utils'
import SocialDrawer from '@app/views/components/InstantMarketing/components/SocialDrawer'

import { isSocialPostTimeout, isSocialPostFailed } from './helpers'
import { useGetFacebookPageById } from './use-get-facebook-page-by-id'

interface SocialPostPreviewButtonProps extends Omit<ButtonProps, 'onClick'> {
  socialPost: ISocialPost<'template_instance' | 'owner'>
  onSocialPostScheduledOrSent: () => void
}

function SocialPostPreviewButton({
  socialPost,
  disabled,
  onSocialPostScheduledOrSent,
  ...buttonProps
}: SocialPostPreviewButtonProps) {
  const [open, setOpen] = useState(false)

  const openDialog = () => setOpen(true)

  const closeDialog = () => setOpen(false)

  const handleSocialPostScheduledOrSent = () => {
    closeDialog()
    onSocialPostScheduledOrSent()
  }

  const { isLoading, facebookPage } = useGetFacebookPageById(
    socialPost.facebook_page
  )

  const isFailed = isSocialPostFailed(socialPost)

  return (
    <>
      <Button
        {...buttonProps}
        onClick={openDialog}
        disabled={isLoading || disabled}
      >
        {isFailed ? 'Retry' : 'Reschedule'}
      </Button>
      {open && (
        <SocialDrawer
          title={`${isFailed ? 'Retry' : 'Reschedule'} Social Post`}
          instance={socialPost.template_instance}
          initialStep="Schedule"
          onClose={closeDialog}
          socialPostFormInitialValues={{
            caption: socialPost.caption,
            dueAt: !isSocialPostTimeout(socialPost)
              ? convertTimestampToDate(socialPost.due_at)
              : null,
            facebookPage
          }}
          onPostScheduled={handleSocialPostScheduledOrSent}
          onPostSent={handleSocialPostScheduledOrSent}
        />
      )}
    </>
  )
}

export default SocialPostPreviewButton
