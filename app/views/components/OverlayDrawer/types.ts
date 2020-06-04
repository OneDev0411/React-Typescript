import { DrawerProps as OriginalDrawerProps } from '@material-ui/core/Drawer'
import { ModalProps } from '@material-ui/core/Modal'

type DrawerCloseReason =
  | Parameters<Required<ModalProps>['onClose']>[1]
  | 'closeButtonClick'

export interface DrawerProps extends OriginalDrawerProps {
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  onClose: (event: {}, reason: DrawerCloseReason) => void
}

export interface StyleProps {
  width?: string | number
  zIndex?: number
}

export interface DrawerContextType extends Pick<DrawerProps, 'onClose'> {
  /**
   * For drawers on drawers
   */
  level: number
}
