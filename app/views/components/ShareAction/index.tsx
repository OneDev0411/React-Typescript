import React, { useState } from 'react'

import { StateContext } from './context'

interface Props {
  children: React.ReactNode
}

export function ShareAction({ children }: Props) {
  const [selections, updateSelections] = useState<IListing[]>([])

  const addItem = (item: IListing) => {
    updateSelections([...selections, item])
  }

  const removeItem = (item: IListing) => {
    updateSelections(selections.filter(selection => selection.id !== item.id))
  }

  const reinitialize = (items: IListing[]) => updateSelections(items)

  const toggleItem = (item: IListing) => {
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
