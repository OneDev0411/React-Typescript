import { SingleEmailComposeDrawer } from '@app/views/components/EmailCompose'

type Props = {
  isOpen: boolean
  onClose: () => void
  contactEmail: string
  contactName: string
  assignees: BrandedUser[]
}

const IntroduceAssigneesEmailCompose = ({
  isOpen,
  onClose,
  contactEmail,
  contactName,
  assignees
}: Props) => {
  const hasOneAssignee = assignees.length === 1
  const assigneesName = hasOneAssignee
    ? assignees[0].display_name
    : assignees.map(assignee => assignee.display_name).join(', ')
  const assigneesFirstName = hasOneAssignee
    ? assignees[0].display_name.split(' ')[0]
    : assignees.map(assignee => assignee.display_name.split(' ')[0]).join(', ')
  const firstName = contactName.split(' ')[0]

  return (
    <SingleEmailComposeDrawer
      isOpen={isOpen}
      onClose={onClose}
      initialValues={{
        subject: `Intro to ${assigneesName}`,
        to: [
          {
            email: `${contactName} <${contactEmail}>`,
            recipient_type: 'Email'
          },
          ...assignees.map(assignee => ({
            email: `${assignee.display_name} <${assignee.email}>`,
            recipient_type: 'Email' as 'Email'
          }))
        ],
        body: [
          `Hi ${firstName}, <br/><br/>`,
          `I'm reaching out to connect you with ${assigneesName}. <br/><br/>`,
          `I highly recommend ${
            hasOneAssignee
              ? `${assigneesFirstName} is an amazing agent`
              : `${assigneesFirstName} are amazing agents`
          }, and we work together regularly. I'll stay close, but I promise you're in good hands!`
        ].join('')
      }}
    />
  )
}

export default IntroduceAssigneesEmailCompose
