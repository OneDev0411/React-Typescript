export type Recipient =
  | { email: string; contact?: IContact }
  | IContactList
  | IContactTag
