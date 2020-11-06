import React, { useState } from 'react'

import { DefaultValuesContext } from '../context'

interface Props {
  children: React.ReactNode
}

export function DefaultValuesContextProvider({ children }: Props) {
  const [annotation, setAnnotation] = useState<IFormAnnotation | null>(null)
  const [annotationType, setAnnotationType] = useState<Nullable<number>>(null)

  const handleSetAnnotation = (
    annonation: Nullable<IFormAnnotation>,
    type: Nullable<number> = null
  ) => {
    setAnnotation(annonation)
    setAnnotationType(type)
  }

  return (
    <DefaultValuesContext.Provider
      value={{
        annotation,
        annotationType,
        setAnnotation: handleSetAnnotation
      }}
    >
      {children}
    </DefaultValuesContext.Provider>
  )
}
