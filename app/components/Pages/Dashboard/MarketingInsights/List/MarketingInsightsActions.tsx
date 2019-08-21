import React from 'react'

import VerticalDotsIcon from 'components/SvgIcons/MoreVert/IconMoreVert'
import { BasicDropdown } from 'components/BasicDropdown'
import { EditEmailDrawer } from 'components/EmailCompose/EditEmailDrawer'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

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

  if (!props.isVisibile) {
    return null
  }

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
              message: 'Do you want to delete this scheduled email?',
              description: `The email will be deleted and you don't have access to it anymore. Are you sure?`,
              onConfirm: async () => {
                console.log('Confirmed')
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
          onEdited={() => {
            setIsEditComposeOpen(false)
            props.reloadList()
          }}
          emailId={props.data.id}
        />
      )}
    </>
  )
}

export default Actions
