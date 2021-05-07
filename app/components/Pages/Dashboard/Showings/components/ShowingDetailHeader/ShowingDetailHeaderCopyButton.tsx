import { Button } from '@material-ui/core'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'

import { useDispatch } from 'react-redux'

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
    copyTextToClipboard(window.location.origin + bookingUrl)
    dispatch(addNotification({ status: 'success', message: 'Copied!' }))
  }

  return (
    <Button
      className={className}
      size="small"
      variant="outlined"
      startIcon={<FileCopyOutlinedIcon />}
      onClick={handleClick}
    >
      Copy Link
    </Button>
  )
}

export default ShowingDetailHeaderCopyButton
