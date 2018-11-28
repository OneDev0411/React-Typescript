import styled from 'styled-components'

import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { primary } from 'views/utils/colors'

export const Loader = styled(Spinner)`
  width: 5rem;
  height: 5rem;
  fill: ${primary};
`
