import styled from 'styled-components'

export const IntroContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0.5rem 0;
  background-color: #f7f7f7;
  border-radius: 2px;
  padding: 1.625rem 1.625rem;
  position: relative;
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`

export const SectionImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`

export const Divider = styled.div`
  width: 2px;
  height: 138px;
  background-color: #dfdfdf;
  margin: 0 1rem;
`

export const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  margin-top: 0.5rem;
`

export const Description = styled.div`
  font-size: 14px;
  line-height: 1.14;
`

export const CloseButton = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
`
