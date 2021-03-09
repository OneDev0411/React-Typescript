declare interface IBrandChecklist extends IModel<'brand_checklist'> {
  brand: UUID
  title: string
  checklist_type: 'Buying' | 'Selling' | 'Offer'
  title: 'Listing' | 'Contract' | 'Offer'
  is_deactivatable: boolean
  is_terminatable: boolean
  order: number
  property_type: string // it's actually enum
  tab_name: string
  tasks: IBrandChecklistTask[] | null
  optional_contexts: any // TODO
  required_contexts: any // TODO
  statuses: any // TODO
}

declare interface IBrandChecklistTask {
  id: UUID
  title: string
  checklist: UUID
  created_at: string
  deleted_at: null | unknown
  form: UUID
  order: number
  required: boolean
  task_type: IDealTaskType
}

declare type IBrandChecklistTaskInput = Pick<IDealTask, 'task_type'> &
  Partial<
    Pick<IDealTask, 'order' | 'checklist' | 'form' | 'required' | 'title'>
  >
