export interface FormValues {
  first_name: string
  last_name: string
  email?: string
  password: string
  repeatedPassword: string
  user_type: 'Client' | 'Agent'
}
