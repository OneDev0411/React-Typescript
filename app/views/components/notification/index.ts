import { notify, Notification as BaseNotification } from 'reapop'

export interface Notification {
  message: string
  status: BaseNotification['status']
  options?: Omit<BaseNotification, 'message' | 'status'>
}

export function addNotification(data: Notification) {
  return notify(data.message, {
    status: data.status,
    dismissible: true,
    dismissAfter: 4000,
    showDismissButton: true,
    position: 'bottom-right',
    allowHTML: true,
    ...data.options
  })
}
