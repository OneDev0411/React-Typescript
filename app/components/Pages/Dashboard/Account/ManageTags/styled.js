import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const AddTagContainer = styled.div`
  margin-left: 2.1875rem;
  margin-bottom: 1rem;
`

export const AddTagInputContainer = styled.div`
  width: 100%;
  max-width: 700px;
`

export const Description = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  color: #4a4a4a;
  margin-top: 0;
  margin-bottom: 0.5rem;
`

export const TextInputSuffix = styled.button`
  outline: none;
  border: none;
  background: transparent;
  font-size: 1rem;
  padding: 0 1rem;
  margin: auto;
  color: ${({ disabled, theme }) =>
    disabled ? theme.palette.grey[600] : theme.palette.primary.main};
`

export const TextInputPrefix = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.75rem;
`
