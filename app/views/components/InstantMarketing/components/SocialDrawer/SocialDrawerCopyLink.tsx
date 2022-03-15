import { mdiContentCopy } from '@mdi/js'

import useNotify from '@app/hooks/use-notify'
import copy from '@app/utils/copy-text-to-clipboard'
import { truncateTextFromMiddle } from '@app/utils/truncate-text-from-middle'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import SocialDrawerAction from './SocialDrawerAction'

interface SocialDrawerCopyLinkProps {
  className?: string
  instance: IMarketingTemplateInstance | IBrandAsset
}

function SocialDrawerCopyLink({
  className,
  instance
}: SocialDrawerCopyLinkProps) {
  const notify = useNotify()

  const handleCopyLink = () => {
    copy(instance.branch ?? instance.file.url)

    notify({
      message: 'Link Copied',
      status: 'success'
    })
  }

  return (
    <SocialDrawerAction
      className={className}
      textFieldProps={{
        label: 'Link:',
        InputProps: { readOnly: true },
        defaultValue: truncateTextFromMiddle(
          instance.branch ?? instance.file.url,
          33
        ),
        onClick: handleCopyLink
      }}
      buttonProps={{
        children: 'Copy',
        startIcon: <SvgIcon path={mdiContentCopy} size={muiIconSizes.small} />,
        onClick: handleCopyLink
      }}
    />
  )
}

export default SocialDrawerCopyLink
