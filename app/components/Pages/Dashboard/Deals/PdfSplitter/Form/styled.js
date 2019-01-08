import styled from 'styled-components'

import { red } from 'views/utils/colors'

export const Container = styled.div`
  padding: 0 0.5rem;
  margin-bottom: 1.5rem;
`

export const FieldCaption = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

export const ErrorMessage = styled.div`
  color: ${red.A100};
  margin: 0.5rem 0;
`

export const SaveModalContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1053;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
`

export const SaveModalBody = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  text-align: center;
  border-radius: 8px;
  width: 31rem;
  min-height: 7rem;
  font-size: 0.875rem;
  font-weight: 500;
`
