import styled from 'styled-components'

import { red, primary } from 'views/utils/colors'

interface TitleProps {
  selectable: boolean
}

interface ChecklistNameProps {
  error: boolean
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

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${(props: TitleProps) => (props.selectable ? '#000' : red.A100)};

  ${(props: TitleProps) =>
    props.selectable &&
    `
    :hover {
      cursor: pointer;
      color: ${primary};
      text-decoration: underline;
    }
  `}
`

export const DateTime = styled.div`
  font-size: 0.875rem;
  color: #7f7f7f;
`

export const ChecklistName = styled.div`
  font-size: 0.875rem;
  color: ${(props: ChecklistNameProps) => (props.error ? red.A100 : '#000')};
`
