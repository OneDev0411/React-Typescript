export interface SocketUpdate {
  upserted: ICalendarEvent[]
  deleted: UUID[]
}

export interface ActionRef {
  updateCrmEvents(
    event: IEvent | ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>,
    type: string
  ): void
}
