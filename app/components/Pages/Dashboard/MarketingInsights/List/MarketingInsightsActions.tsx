import React from 'react'

import { IconButton, MenuItem, Typography } from '@material-ui/core'

import IconHorizontalDots from 'components/SvgIcons/HorizontalDots/IconHorizontalDots'
import { BaseDropdown } from 'components/BaseDropdown'
import { EditEmailDrawer } from 'components/EmailCompose'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { deleteEmailCampaign } from 'models/email/delete-email-campaign'

interface ActionsPropsType {
  data: any
  reloadList: () => void
  isVisibile: boolean
}

function Actions(props: ActionsPropsType) {
  const [isEditComposeOpen, setIsEditComposeOpen] = React.useState(false)
  const confirmation = React.useContext(ConfirmationModalContext)

  return (
    <>
      <BaseDropdown
        PopperProps={{
          placement: 'bottom-end'
        }}
        renderDropdownButton={buttonProps => (
          <IconButton
            {...buttonProps}
            style={{
              padding: 0
            }}
          >
            <IconHorizontalDots />
          </IconButton>
        )}
        renderMenu={({ close }) => (
          <div>
            <MenuItem
              onClick={() => {
                close()
                setIsEditComposeOpen(true)
              }}
            >
              Edit
            </MenuItem>

            <MenuItem
              onClick={e => {
                close()
                confirmation.setConfirmationModal({
                  appearance: 'danger',
                  message: 'Do you want to delete this scheduled email?',
                  description:
                    "The email will be deleted and you don't have access to it anymore. Are you sure?",
                  confirmLabel: 'Yes, Remove it',
                  onConfirm: async () => {
                    deleteEmailCampaign(props.data.id).then(() =>
                      props.reloadList()
                    )
                  }
                })
              }}
            >
              <Typography color="error">Delete</Typography>
            </MenuItem>
          </div>
        )}
      />
      {isEditComposeOpen && (
        <EditEmailDrawer
          isOpen
          onClose={() => setIsEditComposeOpen(false)}
          onEdited={() => props.reloadList()}
          onDeleted={() => props.reloadList()}
          emailId={props.data.id}
        />
      )}
    </>
  )
}

export default Actions
