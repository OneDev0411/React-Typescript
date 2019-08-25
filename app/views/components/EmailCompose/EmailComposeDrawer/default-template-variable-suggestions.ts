import { ITemplateVariableSuggestionGroup } from '../../TemplateVariablesButton/types'

export const defaultTemplateVariableSuggestions: ITemplateVariableSuggestionGroup[] = [
  {
    title: 'Recipient Attributes',
    suggestions: [
      {
        title: 'Full Name',
        expression: 'recipient.display_name'
      },
      {
        title: 'First Name',
        expression: 'recipient.first_name'
      },
      {
        title: 'Last Name',
        expression: 'recipient.last_name'
      },
      {
        title: 'Nickname',
        expression: 'recipient.nickname'
      },
      {
        title: 'Title',
        expression: 'recipient.title'
      },
      {
        title: 'Job Title',
        expression: 'recipient.job_title'
      },
      {
        title: 'Email',
        expression: 'recipient.email'
      },
      {
        title: 'Company',
        expression: 'recipient.company'
      }
    ]
  },
  {
    title: 'Sender Attributes',
    suggestions: [
      {
        title: 'Full Name',
        expression: 'sender.display_name'
      },
      {
        title: 'First Name',
        expression: 'sender.first_name'
      },
      {
        title: 'Last Name',
        expression: 'sender.last_name'
      }
    ]
  }
]
