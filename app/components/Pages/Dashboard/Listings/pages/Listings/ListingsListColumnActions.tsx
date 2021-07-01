import ListingsListColumnActionsMegaButton, {
  ListingsListColumnActionsMegaButtonProps
} from './ListingsListColumnActionsMegaButton'

export interface ListingsListColumnActionsProps
  extends Pick<ListingsListColumnActionsMegaButtonProps, 'row' | 'hasActions'> {
  className: string
}

function ListingsListColumnActions({
  className,
  ...otherProps
}: ListingsListColumnActionsProps) {
  return (
    <div className={className}>
      <ListingsListColumnActionsMegaButton {...otherProps} />
    </div>
  )
}

export default ListingsListColumnActions
