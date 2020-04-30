declare interface IBrandChecklist extends IModel<'brand_checklist'> {
  brand: UUID
  title: string
  deal_type: 'Buying' | 'Selling'
  is_deactivatable: boolean
  is_terminatable: boolean
  order: number
  property_type: string // it's actually enum
  tab_name: string
  tasks: IBrandChecklistTask[] | null
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
