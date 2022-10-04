import { useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiEmailOutline } from '@mdi/js'

import {
  EmailFormValues,
  SingleEmailComposeDrawer
} from '@app/views/components/EmailCompose'
import { GridActionButton } from '@app/views/components/Grid/Table/features/Actions/Button'
import config from 'config'
import {
  EMAIL_ENVELOPE,
  EMAIL_FILE,
  EMAIL_FORM,
  SELECT_TASK
} from 'deals/components/ActionsButton/data/action-buttons'
import {
  ADD_ATTACHMENTS,
  RESET,
  CANCEL,
  SELECT_TASKS,
  SET_FORM_META
} from 'deals/contexts/actions-context/constants'

import { DealTaskActionsStateContext } from '../../../../contexts/actions-context'
import { useChecklistActionsContext } from '../../../../contexts/actions-context/hooks'

interface Props {
  deal: IDeal
}

export function NotifyAgents({ deal }: Props) {
  const [, dispatch] = useChecklistActionsContext()
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<IDealTask[]>([])

  const handleNotifyAgents = () => {
    dispatch({
      type: RESET
    })

    dispatch({
      type: SELECT_TASKS,
      tasks: [],
      actions: [SELECT_TASK],
      buttons: (state: DealTaskActionsStateContext) => [
        <GridActionButton
          key="action-send-email"
          label="Send Email"
          disabled={!state.tasks?.length}
          icon={mdiEmailOutline}
          onClick={() => handleShowEmailDrawer(state)}
        />
      ]
    })
  }

  const handleCancel = () => {
    dispatch({
      type: CANCEL
    })

    setIsEmailDrawerOpen(false)
  }

  const handleShowEmailDrawer = (state: DealTaskActionsStateContext) => {
    dispatch({
      type: RESET
    })

    setSelectedTasks(state.tasks!)
    setIsEmailDrawerOpen(true)
  }

  const getTaskLink = (task: IDealTask) =>
    `${config.app.url}/dashboard/deals/${deal.id}?task-detail=${task.id}`

  const handleClickAddDealAttachments = (formValues: EmailFormValues) => {
    dispatch({
      type: RESET
    })

    dispatch({
      type: ADD_ATTACHMENTS,
      attachments: [],
      actions: [EMAIL_ENVELOPE, EMAIL_FORM, EMAIL_FILE]
    })

    dispatch({
      type: SET_FORM_META,
      form: formValues
    })

    setIsEmailDrawerOpen(false)
  }

  return (
    <>
      <Button size="small" variant="outlined" onClick={handleNotifyAgents}>
        Notify Agents
      </Button>

      {isEmailDrawerOpen && (
        <SingleEmailComposeDrawer
          isOpen={isEmailDrawerOpen}
          initialValues={{
            subject: `[Important]: Missing documents for your closing of "${deal.title}"`,
            body: [
              'Hello,<br /><br />',
              'The following documents are still missing from the company file.<br />',
              'Please be sure to upload them into StudioPro (Rechat)',
              '<ul>',
              ...selectedTasks.map(
                task =>
                  `<li><a href="${getTaskLink(task)}">${task.title}</a></li>`
              ),
              '</ul>',
              '<p>Best Regards</p>'
            ].join('')
          }}
          deal={deal}
          onClickAddDealAttachments={handleClickAddDealAttachments}
          onClose={handleCancel}
          onSent={handleCancel}
        />
      )}
    </>
  )
}
