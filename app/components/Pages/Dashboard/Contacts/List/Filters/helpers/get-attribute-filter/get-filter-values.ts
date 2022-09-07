import { ORIGINS } from '../../../constants'

const payloadGenerator = (value: any, label: string) => [
  {
    label,
    value
  }
]
export const getFilterValues = (
  value: any,
  attribute: IContactAttributeDef
) => {
  if (attribute.data_type === 'date') {
    return payloadGenerator('fff', 'fff')
  }

  const origins = ORIGINS
  const nextLabel = origins.find(item => item.value === value)?.label ?? value

  return payloadGenerator(value, nextLabel)
}
