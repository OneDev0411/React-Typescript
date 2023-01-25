export const initialNotificationBadges: INotificationBadges = {
  deal_need_attentions: 0,
  deal_notifications: 0,
  showing_notifications: 0,
  generic: 0,
  unread_email_threads: 0
}

export const initialNotificationBadgesContextValue = {
  badges: initialNotificationBadges,
  reload: () => {},
  resetAllBadges: () => {},
  increaseBadgeCounter: (type: keyof INotificationBadges) => {},
  decreaseBadgeCounter: (type: keyof INotificationBadges) => {},
  setBadgeCounter: (type: keyof INotificationBadges, value: number) => {}
}
