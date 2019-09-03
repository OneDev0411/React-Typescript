declare type CRMTaskAssociation =
  | 'assignees'
  | 'associations'
  | 'created_by'
  | 'updated_by'
  // | 'files' Currently we didn't implement this association on the Web APP
  | 'reminders'

declare type ICRMTask<
  Associations extends CRMTaskAssociation = '',
  CRMTaskAssociations extends CRMTaskAssociationType = ''
> = {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at: number
  title: string
  description: string
  due_date: number
  status: 'PENDING' | 'DONE'
  task_type: CRMTaskTypes
  metadata: any
  brand: UUID
  type: 'crm_task'
} & Association<
  'associations',
  ICRMTaskAssociation<CRMTaskAssociations>[] | null,
  Associations
> &
  Association<'assignees', IUser[] | null, Associations> &
  Association<'created_by', IUser, Associations> &
  Association<'updated_by', IUser, Associations> &
  // Association<'files', any[] | null, Associations> &
  Association<'reminders', ICRMTaskReminder[] | null, Associations> &
  Association<'contacts', UUID[], Associations, 'associations'> &
  Association<'deals', UUID[], Associations, 'associations'> &
  Association<'emails', UUID[], Associations, 'associations'> &
  Association<'listings', UUID[], Associations, 'associations'>
