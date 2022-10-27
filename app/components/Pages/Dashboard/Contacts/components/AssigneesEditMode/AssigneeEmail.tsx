import { SingleEmailComposeDrawer } from '@app/views/components/EmailCompose'

type assigneeEmailProps = {
  isOpen: boolean
  onClose: () => void
  contactEmail: string
  currentAgentName: string
  currentAgentEmail: string
  contactName: string
}

const AssigneeEmail = ({
  isOpen,
  onClose,
  contactEmail,
  currentAgentName,
  currentAgentEmail,
  contactName
}: assigneeEmailProps) => {
  return (
    <SingleEmailComposeDrawer
      isOpen={isOpen}
      onClose={onClose}
      initialValues={{
        subject: `Intro to ${currentAgentName}`,
        to: [
          {
            email: `${contactName} <${contactEmail}>`,
            recipient_type: 'Email'
          },
          {
            email: `${currentAgentName} <${currentAgentEmail}>`,
            recipient_type: 'Email'
          }
        ],
        body: [
          `Hi ${contactName} <br/> <br/>`,
          `I'm reaching out to connect you with ${currentAgentName}. <br/> <br/>`,
          `I highly recommend ${currentAgentName}, and we work together regularly. I'll stay close, but I promise you're in good hands!`
        ].join('')
      }}
    />
  )
}

export default AssigneeEmail
