import { PopperPlacementType } from '@material-ui/core'
import { ReferenceObject } from 'popper.js'

export interface ReminderDialogBaseProps {
  userSettingsKey: string
  anchorEl: Nullable<ReferenceObject | (() => ReferenceObject)>
  title: string
  buttonText?: string
  checkboxText?: string
  image?: string
  arrow?: boolean
  placement?: PopperPlacementType
}
