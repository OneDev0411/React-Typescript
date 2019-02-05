import styled from 'styled-components'

import LinkButton from 'components/Button/LinkButton'

export const Container = styled.div`
  justify-content: space-between;
  align-items: center;

  ${props =>
    props.isOpen === false &&
    `
    display: none;
  `};
`

export const FileContainer = styled.div`
  width: 100%;
  background-color: #f7f7f7;

  :hover {
    background-color: #f2f2f2;
  }

  ${props =>
    props.isBlur &&
    `
    filter: blur(5px);
  `};
`

export const FileTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
`

export const FileLink = styled(LinkButton)`
  color: #000;
  font-size: 1rem;
  font-weight: 500;
  padding: 0;
  margin: 0;
`

export const FileRow = styled.div`
  display: flex;
  flex-direction: column;

  border-bottom: solid 1px #e6e6e6;
  padding: 0.825rem 1rem;
  padding-left: 3rem;

  :hover a.file-link {
    color: #003bdf !important;
  }
`
