export interface StateProps {
  viewAsUsers: UUID[]
  user: IUser
}

export interface SocketUpdate {
  upserted: ICalendarEvent[]
  deleted: UUID[]
}

export interface ActionRef {
  updateCrmEvents(event: IEvent, type: string): void
}
