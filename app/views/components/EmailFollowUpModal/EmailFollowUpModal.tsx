import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import fecha from 'fecha'
import { addNotification as notify } from 'reapop'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'

import { createTask } from 'models/tasks/create-task'
import { EventDrawer } from 'components/EventDrawer'
import { preSaveFormat } from 'components/EventDrawer/helpers/pre-save-format'
import { initialValueGenerator } from 'components/EventDrawer/helpers/initial-value-generator'
import Dialog from 'components/Dialog'
import { EmailThreadEmail } from 'components/EmailThread/types'
import { IAppState } from 'reducers'
import { normalizeAssociations } from 'views/utils/association-normalizers'

export default EmailFollowUpModal

const oneDayTimestamp = 24 * 3600000
const todayTimestamp = new Date().getTime()
const tomorrowTimestamp = todayTimestamp + oneDayTimestamp

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    marginBottom: theme.spacing(2)
  },
  optionButton: {
    marginBottom: theme.spacing(2)
  }
}))

type FollowUpEmail =
  | IEmailCampaign<
      IEmailCampaignAssociation,
      IEmailCampaignRecipientAssociation,
      IEmailCampaignEmailAssociation
    >
  | EmailThreadEmail
  | null

interface Props {
  email: FollowUpEmail
  isOpen: boolean
  onClose: () => void
}

function EmailFollowUpModal({ email, onClose, isOpen }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector<IAppState, IUser>(state => state.user)
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false)
  const crmTask = useMemo(
    () => getCrmTask(email, new Date(tomorrowTimestamp), user),
    [email, user]
  )

  const handleClose = () => {
    onClose()
  }

  const setFollowUp = async event => {
    let dueDate = tomorrowTimestamp
    const { dueDateType } = event.currentTarget.dataset

    switch (dueDateType) {
      case 'day':
        dueDate = tomorrowTimestamp
        break
      case 'week':
        dueDate = todayTimestamp + 7 * oneDayTimestamp
        break
      default:
        break
    }

    if (dueDateType === 'custom') {
      setIsEventDrawerOpen(true)
    } else {
      const task = await preSaveFormat(
        getCrmTask(email, new Date(dueDate), user)
      )

      await createTask(task)

      onClose()

      dispatch(
        notify({
          status: 'success',
          message: 'The follow up task is added!'
        })
      )
    }
  }

  return (
    <>
      <Dialog
        id="email-follow-up-dialog"
        open={isOpen}
        onClose={handleClose}
        title="Set a follow up?"
        maxWidth="xs"
      >
        <Typography gutterBottom className={classes.description}>
          Growing sales is all about setting the next follow up, put a reminder
          on your calendar now!
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={setFollowUp}
          data-due-date-type="day"
          className={classes.optionButton}
        >
          Tomorrow
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={setFollowUp}
          data-due-date-type="week"
          className={classes.optionButton}
        >
          Next Week
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={setFollowUp}
          data-due-date-type="custom"
          className={classes.optionButton}
        >
          Custom
        </Button>
      </Dialog>
      {isEventDrawerOpen && (
        <EventDrawer
          isOpen
          initialValues={crmTask}
          title="Add a follow up"
          submitCallback={onClose}
          onClose={() => setIsEventDrawerOpen(false)}
        />
      )}
    </>
  )
}

function getCrmTask(email: FollowUpEmail, dueDate: Date, user: IUser) {
  if (!email) {
    return undefined
  }

  if ('type' in email && email.type === 'email_campaign') {
    return getCrmTaskFromEmailCampaign(email)
  }

  return getCrmTaskFromEmailThreadEmail(email as EmailThreadEmail)

  function getCrmTaskFromEmailCampaign(
    email: IEmailCampaign<
      IEmailCampaignAssociation,
      IEmailCampaignRecipientAssociation,
      IEmailCampaignEmailAssociation
    >
  ) {
    const owner = email.from.type === 'user' ? email.from : user
    const contactAssociations = email.recipients
      .filter(resp => resp.contact)
      .map(resp => ({
        contact: resp.contact,
        association_type: 'contact'
      }))
    const title = `Follow up with ${contactAssociations[0]?.contact.display_name}`
    const description = `This is a follow up reminder ${
      owner.display_name
    } set in Rechat, on ${fecha.format(
      email.due_at * 1000,
      'dddd MMMM Do, YYYY'
    )} for the attached email.`

    const values = initialValueGenerator(
      owner,
      normalizeAssociations([
        ...contactAssociations,
        {
          association_type: 'email',
          email
        }
      ]),
      dueDate,
      undefined,
      title,
      description
    )

    return values
  }

  function getCrmTaskFromEmailThreadEmail(email: EmailThreadEmail) {
    const owner = user
    const contactAssociations =
      email.thread?.contacts?.map?.(contact => ({
        contact,
        association_type: 'contact'
      })) || []
    const title = `Follow up with ${email.to[0]}`
    const description = `This is a follow up reminder ${
      owner.display_name
    } set in Rechat, on ${fecha.format(
      email.date,
      'dddd MMMM Do, YYYY'
    )} for the attached email.`

    const values = initialValueGenerator(
      owner,
      normalizeAssociations(contactAssociations),
      dueDate,
      undefined,
      title,
      description
    )

    return values
  }
}
