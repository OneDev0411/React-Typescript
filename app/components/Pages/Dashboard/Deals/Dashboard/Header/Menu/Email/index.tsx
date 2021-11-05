import { Button } from '@material-ui/core'

import {
  EMAIL_ENVELOPE,
  EMAIL_FORM,
  EMAIL_FILE
} from 'deals/components/ActionsButton/data/action-buttons'
import {
  ADD_ATTACHMENTS,
  SET_DRAWER_STATUS
} from 'deals/contexts/actions-context/constants'
import { useChecklistActionsContext } from 'deals/contexts/actions-context/hooks'

export function Email() {
  const [, dispatch] = useChecklistActionsContext()

  const handleEmail = () => {
    dispatch({
      type: ADD_ATTACHMENTS,
      attachments: [],
      actions: [EMAIL_ENVELOPE, EMAIL_FORM, EMAIL_FILE]
    })

    dispatch({
      type: SET_DRAWER_STATUS,
      isDrawerOpen: true
    })
  }

  return (
    <Button size="small" variant="outlined" onClick={handleEmail}>
      Email
    </Button>
  )
}
