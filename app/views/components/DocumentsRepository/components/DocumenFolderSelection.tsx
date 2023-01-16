import { useEffect, useState, useMemo } from 'react'

import { Checkbox } from '@material-ui/core'

interface Props {
  totalCount: number
  selectionList: Record<string, boolean>
  onChange: (checked: boolean) => void
}

export function DocumentFolderSelection({
  selectionList,
  totalCount,
  onChange
}: Props) {
  const selectedCount = useMemo(
    () => Object.values(selectionList).filter(state => !!state).length,
    [selectionList]
  )
  const [isChecked, setIsChecked] = useState(selectedCount === totalCount)
  const [isIndeterminate, setIsIndeterminate] = useState(false)

  useEffect(() => {
    if (selectedCount === totalCount) {
      setIsChecked(true)
      setIsIndeterminate(false)
    }

    if (selectedCount === 0) {
      setIsChecked(false)
      setIsIndeterminate(false)
    }

    if (selectedCount > 0 && selectedCount < totalCount) {
      setIsIndeterminate(true)
      setIsChecked(false)
    }
  }, [selectedCount, totalCount])

  const handleChangeSelection = (checked: boolean) => {
    setIsChecked(checked)
    setTimeout(() => onChange(checked), 0)
  }

  return (
    <Checkbox
      checked={isChecked}
      color="primary"
      indeterminate={isIndeterminate}
      onChange={(_, checked) => handleChangeSelection(checked)}
    />
  )
}
