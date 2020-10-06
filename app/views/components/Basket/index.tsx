import React, { useState } from 'react'

import { StateContext } from './context'

interface Props {
  children: React.ReactNode
}

export function Basket<T extends IModel<any>>({ children }: Props) {
  const [selections, updateSelections] = useState<T[]>([])

  const addItem = (item: T) => {
    updateSelections([...selections, item])
  }

  const removeItem = (item: T) => {
    updateSelections(selections.filter(selection => selection.id !== item.id))
  }

  const reinitialize = (items: T[]) => updateSelections(items)

  const toggleItem = (item: T) => {
    if (selections.some(selection => selection.id === item.id)) {
      removeItem(item)
    } else {
      addItem(item)
    }
  }

  return (
    <StateContext.Provider
      value={{
        selections,
        toggleItem,
        addItem,
        removeItem,
        reinitialize
      }}
    >
      {children}
    </StateContext.Provider>
  )
}
