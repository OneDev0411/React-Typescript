import { ORIGINS } from '../../constants'

const getFilterLabelByValue = value => {
  const origins = ORIGINS
  const origin = origins.find(item => item.value === value)

  return origin ? origin.label : value
}

export default getFilterLabelByValue
