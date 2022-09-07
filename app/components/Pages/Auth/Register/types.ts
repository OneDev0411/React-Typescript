export interface FormValues {
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  password: string
  user_type: 'Client' | 'Agent'
}
