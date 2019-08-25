declare interface IFlowStepInput {
  flow: UUID
  origin: UUID
  contact: UUID
  event?: UUID
  email?: UUID
}

declare interface IFlowEventInput {
  origin: UUID
  due_date: number
  contact: UUID
}

declare interface IFlowEmailInput {
  origin: UUID
  due_date: number
  contact: UUID
  is_automated: boolean
  event_title?: string
}

declare interface IFlowEnrollInput {
  origin: UUID
  starts_at: number
  contacts: UUID[]
  steps: UUID[]
}

declare interface IFlow extends IModel {
  origin: UUID
  origin_id: UUID
  starts_at: number
  contact: UUID
  brand: UUID
  name: string
  description?: string
  steps: UUID[]
}
declare interface IFlowStep extends IModel {
  flow: UUID
  origin: UUID
  crm_task?: UUID
  email?: UUID
}
