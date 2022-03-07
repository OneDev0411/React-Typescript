import { CellProps } from '../../../../types'
import { DateInlineEdit } from '../../../inline-edit/Date'
import { CellContainer } from '../../CellContainer'

interface Props {
  value: Nullable<Date>
  dateFormat?: string
  readOnly?: boolean
  renderCellContent: (props: CellProps) => React.ReactNode
  width: number | string
}

export const DateCell = ({
  value,
  dateFormat = 'MMM D, YYYY',
  readOnly = false,
  renderCellContent,
  width
}: Props) => {
  const renderInlineEdit = () => (
    <DateInlineEdit value={value} readOnly={readOnly} dateFormat={dateFormat} />
  )

  return (
    <CellContainer
      isSelectable
      actionsActivated
      width={width}
      renderCellContent={renderCellContent}
      renderInlineEdit={renderInlineEdit}
    />
  )
}
