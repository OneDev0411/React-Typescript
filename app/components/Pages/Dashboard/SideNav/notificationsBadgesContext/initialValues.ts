export const initialBadges: INotificationsBadges = {
  deal_need_attentions: 0,
  deal_notifications: 0,
  showing_notifications: 0,
  generic: 0,
  unread_email_threads: 0
}

export const initialNotificationsBadgesContextValue = {
  badges: initialBadges,
  reload: () => {},
  resetAllBadges: () => {},
  increaseBadge: (type: keyof INotificationsBadges) => {},
  decreaseBadge: (type: keyof INotificationsBadges) => {},
  setBadge: (type: keyof INotificationsBadges, value: number) => {}
}
