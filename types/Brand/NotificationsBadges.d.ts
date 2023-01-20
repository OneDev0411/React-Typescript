declare interface INotificationsBadges
  extends IModel<'notification_badge_stats'> {
  deal_notifications: number
  deal_need_attentions: number
  unread_email_threads: number
  showing_notifications: number
  generic: number
}
