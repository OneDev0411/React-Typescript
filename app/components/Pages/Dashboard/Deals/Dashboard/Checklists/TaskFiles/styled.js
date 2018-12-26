import styled from 'styled-components'

import AttachmentIcon from 'components/SvgIcons/Attachment/IconAttacment'
import DigitalFileIcon from 'components/SvgIcons/File/IconFile'
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

  :hover {
    background-color: #f7f7f7;
  }

  ${props =>
    props.isBlur &&
    `
    filter: blur(5px);
  `};
`

export const FileTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`

export const FileActions = styled.div`
  svg {
    fill: rgba(0, 0, 0, 0.2);
  }
`

export const DigitalFormIcon = styled(DigitalFileIcon)`
  fill: #000 !important;
  margin-right: 0.5rem;
  width: 1.2rem;
`

export const FileIcon = styled(AttachmentIcon)`
  fill: #000 !important;
  margin-right: 0.5rem;
  width: 1rem;
`

export const FileLink = styled(LinkButton)`
  color: #000;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0;
  margin: 0;
`

export const FileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: solid 1px #e6e6e6;
  padding: 1rem;
  padding-right: 0;

  margin-left: 4rem;
  margin-right: 1rem;

  :hover a.file-link {
    color: #003bdf !important;
  }

  :hover ${FileActions} svg {
    fill: #17181a;
  }
`
