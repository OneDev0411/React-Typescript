import { ITemplateVariableSuggestionGroup } from '../TemplateVariablesButton/types'

export const defaultTemplateVariableSuggestions: ITemplateVariableSuggestionGroup[] = [
  {
    title: 'Recipient Attributes',
    suggestions: [
      {
        title: 'Full Name',
        expression: 'recipient.display_name',
        description: "Recipient's full name will be inserted here"
      },
      {
        title: 'First Name',
        expression: 'recipient.first_name',
        description: "Recipient's first name will be inserted here"
      },
      {
        title: 'Last Name',
        expression: 'recipient.last_name',
        description: "Recipient's last name will be inserted here"
      },
      {
        title: 'Nickname',
        expression: 'recipient.nickname',
        description: "Recipient's nickname will be inserted here"
      },
      {
        title: 'Title',
        expression: 'recipient.title',
        description: "Recipient's title will be inserted here"
      },
      {
        title: 'Job Title',
        expression: 'recipient.job_title',
        description: "Recipient's job title will be inserted here"
      },
      {
        title: 'Email',
        expression: 'recipient.email',
        description: "Recipient's email address will be inserted here"
      },
      {
        title: 'Company',
        expression: 'recipient.company',
        description: "Recipient's company name will be inserted here"
      }
    ]
  },
  {
    title: 'Sender Attributes',
    suggestions: [
      {
        title: 'Full Name',
        expression: 'sender.display_name',
        description: "Sender's display name will be inserted here"
      },
      {
        title: 'First Name',
        expression: 'sender.first_name',
        description: "Sender's first name will be inserted here"
      },
      {
        title: 'Last Name',
        expression: 'sender.last_name',
        description: "Sender's last name will be inserted here"
      }
    ]
  }
]
