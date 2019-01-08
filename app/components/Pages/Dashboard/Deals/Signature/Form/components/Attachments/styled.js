import styled from 'styled-components'

import IconClose from 'components/SvgIcons/Close/CloseIcon'
import { red, primary } from 'views/utils/colors'

export const Container = styled.div`
  margin: 1rem 0;
`
export const DeleteIcon = styled(IconClose)`
  fill: ${red.A100};
  cursor: pointer;
  opacity: 0;

  :hover {
    fill: ${red.A200};
  }
`

export const Item = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 3px;
  background-color: #f2f2f2;
  width: 16rem;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem 0;

  :hover ${DeleteIcon} {
    opacity: 1;
  }
`

export const Title = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  line-height: 1.14;
  color: #000000;

  a {
    color: #000;
    :hover {
      text-decoration: underline;
      color: ${primary};
    }
  }
`

export const DateTime = styled.div`
  font-size: 0.875rem;
  color: #7f7f7f;
`

export const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  border-radius: 50%;
  margin-right: 0.25rem;
  width: 2rem;
  height: 2rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: #fff !important;
  }
`
