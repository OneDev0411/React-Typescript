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
        body: [
          `Hi ${currentAgentName} <br/> <br/>`,
          'Can you help me out? <br/><br/>',
          'As I so often turn to you for advice when it comes to my business, I&apos;d love if you could help in finding me some new Clients.<br/><br/>',
          'If you could refer anyone in your network that you think would benefit from my help or services, please send them my way. <br/><br/>',
          'I know your good word goes a long way with these things, and because of your insight on my business, you know what a qualified client looks like for me! <br/><br/>',
          'I appreciate it!<br/><br/>',
          'Cheers, <br/>',
          `${contactName}`
        ].join('')
      }}
    />
  )
}

export default AssigneeEmail
