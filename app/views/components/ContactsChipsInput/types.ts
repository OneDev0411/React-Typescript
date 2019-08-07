export type Recipient =
  | { email: string; contact?: INormalizedContact }
  | IContactList
  | IContactTag
