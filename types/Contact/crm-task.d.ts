declare type CRMTaskAssociation =
  | 'assignees'
  | 'associations'
  | 'created_by'
  | 'updated_by'
  // | 'files' Currently we didn't implement this association on the Web APP
  | 'reminders'

declare type ICRMTaskStatus = 'PENDING' | 'DONE'

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
  end_date: Nullable<number>
  status: ICRMTaskStatus
  task_type: CRMTaskTypes
  metadata: any
  brand: UUID
  type: 'crm_task'
} & Association<
  'associations',
  Nullable<ICRMTaskAssociation<CRMTaskAssociations>[]>,
  Associations
> &
  Association<'assignees', Nullable<IUser[]>, Associations> &
  Association<'created_by', IUser, Associations> &
  Association<'updated_by', IUser, Associations> &
  // Association<'files', any[] | null, Associations> &
  Association<'reminders', Nullable<ICRMTaskReminder[]>, Associations> &
  Association<'contacts', UUID[], Associations, 'associations'> &
  Association<'deals', UUID[], Associations, 'associations'> &
  Association<'emails', UUID[], Associations, 'associations'> &
  Association<'listings', UUID[], Associations, 'associations'>
