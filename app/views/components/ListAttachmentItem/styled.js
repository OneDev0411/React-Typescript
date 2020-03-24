import styled, { css } from 'styled-components'

import IconClose from 'components/SvgIcons/Close/CloseIcon'

export const DeleteIcon = styled(IconClose)`
  ${({ theme }) => css`
    fill: ${theme.palette.error.main};
    cursor: pointer;
    opacity: 0;
    width: 1rem;
    margin-left: ${theme.spacing(1)}px;

    :hover {
      fill: ${theme.palette.error.light};
    }
  `}
`

export const Item = styled.div`
  ${({ theme }) => css`
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 3px;
    background-color: #f2f2f2;
    width: 16rem;
    padding: ${theme.spacing(1)}px;
    margin: ${theme.spacing(0, 1, 1, 0)};

    :hover ${DeleteIcon} {
      opacity: 1;
    }
  `}
`

export const Title = styled.div`
  ${({ theme }) => css`
    font-size: 0.875rem;
    font-weight: bold;
    line-height: 1.14;
    color: ${theme.palette.common.black};

    a {
      color: ${theme.palette.common.black};
      :hover {
        text-decoration: underline;
        color: ${theme.palette.secondary.main};
      }
    }
  `}
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

  svg {
    width: 1rem;
    height: 1rem;
    fill: #fff !important;
  }
`
