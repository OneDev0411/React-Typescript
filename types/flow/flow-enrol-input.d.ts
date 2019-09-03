declare interface IFlowEnrollInput {
  contacts: {
    ids: UUID[]
  }
  origin: UUID
  starts_at: number
  steps: UUID[]
}
