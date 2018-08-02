import styled from 'styled-components'

export const Label = styled.label`
  display: block;
  padding-top: 1em;
  margin-bottom: 0.5em;
  line-height: 1;
  font-weight: normal;
  cursor: pointer;
`

export const FieldsWrapper = styled.div`
  display: flex;
  margin-bottom: 0.5em;

  .has-error & {
    margin-bottom: 1em;
  }
`
