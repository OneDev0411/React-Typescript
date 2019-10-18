import React from 'react'

import VerticalDotsIcon from 'components/SvgIcons/MoreVert/IconMoreVert'
import { BasicDropdown } from 'components/BasicDropdown'
import { EditEmailDrawer } from 'components/EmailCompose'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { deleteEmailCampaign } from 'models/email/delete-email-campaign'

enum InsightActionsEnum {
  DELETE = 'delete',
  EDIT = 'edit'
}

const insightActions = [
  {
    value: InsightActionsEnum.EDIT,
    label: 'Edit'
  },
  {
    value: InsightActionsEnum.DELETE,
    label: 'Delete'
  }
]

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
      <BasicDropdown
        fullHeight
        pullTo="right"
        selectedItem={null}
        buttonRenderer={(btnProps: any) => <VerticalDotsIcon {...btnProps} />}
        items={insightActions}
        onSelect={(selectedItem: {
          value: InsightActionsEnum
          label: string
        }) => {
          if (selectedItem.value === InsightActionsEnum.DELETE) {
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
          } else if (selectedItem.value === InsightActionsEnum.EDIT) {
            setIsEditComposeOpen(true)
          }
        }}
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
