import { ITemplateVariableSuggestionGroup } from '../../TemplateVariablesButton/types'

export const defaultTemplateVariableSuggestions: ITemplateVariableSuggestionGroup[] = [
  {
    title: 'Contact Attributes',
    suggestions: [
      {
        title: 'Full Name',
        expression: 'contact.fullName'
      },
      {
        title: 'First Name',
        expression: 'contact.firstName'
      },
      {
        title: 'Last Name',
        expression: 'contact.lastName'
      },
      {
        title: 'Email',
        expression: 'contact.email'
      }
    ]
  },
  {
    title: 'Agent Attributes',
    suggestions: [
      {
        title: 'Full Name',
        expression: 'user.fullName'
      },
      {
        title: 'First Name',
        expression: 'user.firstName'
      },
      {
        title: 'Last Name',
        expression: 'user.lastName'
      },
      {
        title: 'Email',
        expression: 'user.email'
      },
      {
        title: 'First Name',
        expression: 'user.fidsarstName'
      },
      {
        title: 'Last Name',
        expression: 'user.lastdasame'
      },
      {
        title: 'Email',
        expression: 'user.emadsl'
      }
    ]
  }
]
