import { DialogProps } from '@material-ui/core'

export type TabValue =
  | 'upload-photo'
  | 'team-library'
  | 'photo-library'
  | 'gif-library'

export interface ImageSelectDialogProps {
  onSelect: (imageUrl: string) => void
  onUpload?: (file: File) => Promise<string>
  onClose: () => void
  dialogProps?: DialogProps
}

export interface SearchableImageTabProps {
  onSelect: ImageSelectDialogProps['onSelect']
  onEdit?: (file: File | string) => void
  setQuery?: (query: string) => void
  query: string
}

export interface UploadableImageTabProps {
  onSelectFile: (file: File) => void
}
