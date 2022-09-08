import { SingleEmailComposeDrawer } from '@app/views/components/EmailCompose'

type assigneeEmailProps = {
  isOpen: boolean
  onClose: () => void
  currentAgentEmail: string
  currentAgentName: string
  contactName: string
}

const AssigneeEmail = ({
  isOpen,
  onClose,
  currentAgentEmail,
  currentAgentName,
  contactName
}: assigneeEmailProps) => {
  console.log(currentAgentEmail)

  return (
    <SingleEmailComposeDrawer
      isOpen={isOpen}
      onClose={onClose}
      initialValues={{
        subject: 'Would you refer me to friend or family member?',
        to: [
          {
            email: `${currentAgentName} <${currentAgentEmail}>`,
            recipient_type: 'Email'
          }
        ],
        body: `Hi ${currentAgentName},
  Can you help me out?
  As I so often turn to you for advice when it comes to my business, I'd love if you could help in finding me some new Clients.

  If you could refer anyone in your network that you think would benefit from my help or services, please send them my way.

  I know your good word goes a long way with these things, and because of your insight on my business, you know what a qualified client looks like for me!

  I appreciate it!

  Cheers,
  ${contactName}
  `
      }}
    />
  )
}

export default AssigneeEmail
