import { ITemplateVariableSuggestionGroup } from '../../TemplateVariablesButton/types'

export const defaultTemplateVariableSuggestions: ITemplateVariableSuggestionGroup[] = [
  {
    title: 'Recipient Attributes',
    suggestions: [
      {
        title: 'Full Name',
        expression: 'contact.display_name'
      },
      {
        title: 'First Name',
        expression: 'contact.first_name'
      },
      {
        title: 'Last Name',
        expression: 'contact.last_name'
      },
      {
        title: 'Nickname',
        expression: 'contact.nickname'
      },
      {
        title: 'Title',
        expression: 'contact.title'
      },
      {
        title: 'Job Title',
        expression: 'contact.job_title'
      },
      {
        title: 'Email',
        expression: 'contact.email'
      },
      {
        title: 'Company',
        expression: 'contact.company'
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
