export type InboxFilterTabCode = 'all_emails' | 'has_attachment' | 'unread'

export interface InboxFilterTab {
  readonly code: InboxFilterTabCode
  readonly title: string
  readonly visible: boolean
}

export type InboxFilterTabs = ReadonlyArray<InboxFilterTab>
