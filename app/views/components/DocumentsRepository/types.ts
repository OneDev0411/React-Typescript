export type SelectionType = 'single' | 'multiple'

export type RowActionsBuilder = (rowProps: {
  form: IBrandForm
}) => React.ReactNode
