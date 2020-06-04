import styled, { css } from 'styled-components'

import { Theme } from '@material-ui/core'

interface TitleProps {
  selectable: boolean
  theme: Theme
}

interface ChecklistNameProps {
  error: boolean
  theme: Theme
}

export const Container = styled.div``

export const ViewDocument = styled.div`
  display: none;
`

export const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  box-shadow: 0 1px 0 0 #f5f5f5;

  :hover ${ViewDocument} {
    display: block;
  }
`

export const NameSection = styled.div`
  margin: 0 1rem;
`

export const Title = styled.div<{
  selectable: boolean
}>`
  font-size: 1rem;
  font-weight: 500;
  color: ${(props: TitleProps) =>
    props.selectable
      ? props.theme.palette.common.black
      : props.theme.palette.error.main};

  ${(props: TitleProps) =>
    props.selectable &&
    css`
      :hover {
        cursor: pointer;
        color: ${({ theme }) => theme.palette.secondary.main};
        text-decoration: underline;
      }
    `}
`

export const DateTime = styled.div`
  font-size: 0.875rem;
  color: #7f7f7f;
`

export const ChecklistName = styled.div<{
  error: boolean
}>`
  font-size: 0.875rem;
  color: ${(props: ChecklistNameProps) =>
    props.error
      ? props.theme.palette.error.main
      : props.theme.palette.common.black};
`
