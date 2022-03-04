import type { ListProps } from 'react-window'

function VirtualList({ children: ListRow, itemData }: ListProps) {
  return (
    <>
      {itemData.rows.map((_, index) => (
        <ListRow index={index} data={itemData} key={index} style={{}} />
      ))}
    </>
  )
}

export const VariableSizeList = VirtualList

export const FixedSizeList = VirtualList
