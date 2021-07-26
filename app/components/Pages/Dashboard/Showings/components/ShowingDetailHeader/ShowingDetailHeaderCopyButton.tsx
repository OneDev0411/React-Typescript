import { Button } from '@material-ui/core'
import { mdiContentCopy } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { addNotification } from 'components/notification'
import copyTextToClipboard from 'utils/copy-text-to-clipboard'

interface ShowingDetailHeaderCopyButtonProps {
  className?: string
  bookingUrl: string
}

function ShowingDetailHeaderCopyButton({
  className,
  bookingUrl
}: ShowingDetailHeaderCopyButtonProps) {
  const dispatch = useDispatch()

  const handleClick = () => {
    copyTextToClipboard(bookingUrl)
    dispatch(addNotification({ status: 'success', message: 'Copied!' }))
  }

  return (
    <Button
      className={className}
      size="small"
      variant="outlined"
      startIcon={<SvgIcon path={mdiContentCopy} size={muiIconSizes.small} />}
      onClick={handleClick}
    >
      Copy Link
    </Button>
  )
}

export default ShowingDetailHeaderCopyButton
