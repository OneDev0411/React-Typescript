import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'
import _set from 'lodash/set'
import _clone from 'lodash/cloneDeep'

import { TemplateVariable, TemplateVariableType } from './types'

export function useEntityWithSetter<T extends object>(
  entity: T
): [T, (data: TemplateVariable<TemplateVariableType>[]) => void] {
  const [innerEntity, setInnerEntity] = useState<T>(entity)

  useDeepCompareEffect(() => {
    setInnerEntity(entity)
  }, [entity])

  function setValue(newData: TemplateVariable<TemplateVariableType>[]) {
    const newEntity = _clone<T>(innerEntity)

    newData.forEach(item => {
      _set<T>(newEntity, item.name, item.value)
    })

    setInnerEntity(newEntity)
  }

  return [innerEntity, setValue]
}
