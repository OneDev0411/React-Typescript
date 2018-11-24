import styled, { css } from 'styled-components'

import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import LinkButton from 'components/Button/LinkButton'
import { primary } from 'views/utils/colors'

export const Tab = styled(LinkButton)`
  margin-right: 3rem;
  font-weight: 600;
  padding: 0;

  ${props =>
    props.selected
      ? css`
          color: ${primary};

          &:after {
            content: '';
            height: 2px;
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: ${primary};
          }
        `
      : ''};
`

export const Loader = styled(Spinner)`
  width: 2.5rem;
  height: 2.5rem;
  fill: ${primary};
`
