import { DialogProps } from '@material-ui/core'

export type TabValue = 'photo-library' | 'gif-library'

export interface ImageSelectDialogProps {
  onSelect: (imageUrl: string) => void
  onClose: () => void
  dialogProps?: DialogProps
}

export interface ImagesTabProps {
  query: string
  onSelect: ImageSelectDialogProps['onSelect']
}
