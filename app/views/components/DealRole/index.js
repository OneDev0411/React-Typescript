import { Dialog, DialogContent } from '@material-ui/core'

// eslint-disable-next-line import/no-named-as-default
import DealRole from './Form'

export default function DealRoleModal(props) {
  return (
    <Dialog
      open={props.isOpen}
      fullWidth
      maxWidth="sm"
      className="deal-role-form-modal"
    >
      <DialogContent>
        <DealRole {...props} />
      </DialogContent>
    </Dialog>
  )
}
