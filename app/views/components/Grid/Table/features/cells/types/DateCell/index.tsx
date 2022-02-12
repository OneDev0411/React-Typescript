import { CellProps } from '../../../../types'
import { DateInlineEdit } from '../../../inline-edit/Date'
import CellContainer from '../../CellContainer'

interface Props {
  value: Nullable<Date>
  dateFormat?: string
  readOnly?: boolean
  renderCellContent: (props: CellProps) => React.ReactNode
}

export const DateCell = ({
  value,
  dateFormat = 'MMM D, YYYY',
  readOnly = false,
  renderCellContent
}: Props) => {
  const renderInlineEdit = () => (
    <DateInlineEdit value={value} readOnly={readOnly} dateFormat={dateFormat} />
  )

  return (
    <CellContainer
      isSelectable
      actionsActivated
      renderCellContent={renderCellContent}
      renderInlineEdit={renderInlineEdit}
    />
  )
}
