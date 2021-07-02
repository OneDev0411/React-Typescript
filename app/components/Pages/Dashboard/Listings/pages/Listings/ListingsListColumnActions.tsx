import ListingsListColumnActionsButton, {
  ListingsListColumnActionsButtonProps
} from './ListingsListColumnActionsButton'

export interface ListingsListColumnActionsProps
  extends Pick<ListingsListColumnActionsButtonProps, 'row' | 'hasActions'> {
  className: string
}

function ListingsListColumnActions({
  className,
  ...otherProps
}: ListingsListColumnActionsProps) {
  return (
    <div className={className}>
      <ListingsListColumnActionsButton {...otherProps} />
    </div>
  )
}

export default ListingsListColumnActions
