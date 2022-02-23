import { useAlertFeed } from '@app/models/listings/alerts/use-alert-feed'

import AlertViewerModal from './AlertViewerModal'

interface Props {
  alert: any
  isOpen: boolean
  onClose: () => void
}

export default function AlertFeedModalViewer({
  alert,
  isOpen,
  onClose
}: Props) {
  const { isLoading, data } = useAlertFeed(alert.id, alert.room, isOpen)

  const feed = data ? data[alert.id] : []

  const handleClose = () => {
    onClose()
  }

  return (
    <AlertViewerModal
      feed={feed}
      isOpen={isOpen}
      isLoading={isLoading}
      onClose={handleClose}
    />
  )
}
