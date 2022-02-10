import { CellProps } from '../../../types'
import { DateInlineEdit } from '../../inline-edit/Date'
import CellContainer from '../CellContainer'

interface Props {
  value?: Date
  dateFormat?: string
  readOnly?: boolean
  renderCellContent: (props: CellProps) => React.ReactNode
}

const DateCell = ({
  value,
  dateFormat = 'MMM DD, YYYY',
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

export default DateCell
