export function generate_email_request(values, options) {
  return {
    from: values.fromId,
    to: values.recipients,
    subject: values.subject,
    due_at: values.due_at,
    ...options
  }
}
