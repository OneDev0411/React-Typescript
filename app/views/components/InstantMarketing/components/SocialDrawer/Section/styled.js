import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'

export const SectionContainer = styled.div`
  margin-bottom: 2rem;
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  background-color: #f9f9f9;
  border-radius: 3px;
  border: 1px solid #d4d4d4;
  overflow: hidden;
`

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #000;
  margin-bottom: 0.5rem;
`

export const Description = styled.div`
  font-size: 0.875rem;
  color: #7f7f7f;
  margin-top: 0.5rem;
`

export const Button = styled(ActionButton)`
  width: 115px;
  border-radius: 0 2px 2px 0;
  justify-content: center;
`

export const Info = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 115px);
  padding: 0 1rem;

  input {
    background: transparent;
    border: none;
    :focus {
      outline: none;
    }
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 1rem;

    fill: #000;
    g {
      fill: #000;
    }
  }
`
