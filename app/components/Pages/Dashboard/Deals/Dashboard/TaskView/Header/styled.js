import styled from 'styled-components'

import { LatoFamilyStyle } from 'components/Typography/styles'

export const Container = styled.div`
  padding: 0 1.25rem;
  background-color: #fff;
`

export const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.5rem;
`

export const Input = styled.input`
  height: 2.3rem;
  border: 1px solid ${({ theme }) => theme.palette.secondary.main};
  border-radius: 3px;
  padding: 0 0.5rem;
  width: 80%;
`

export const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 1rem;

  .sk-circle {
    margin: 0 !important;
    width: 2rem !important;
    height: 2rem !important;
  }
`

export const Title = styled.div`
  ${LatoFamilyStyle};
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;
  padding: 0.825rem 2px;
  border: 1px dashed transparent;

  :hover {
    cursor: pointer;
    border: 1px dashed ${({ theme }) => theme.palette.secondary.main};
  }
`
