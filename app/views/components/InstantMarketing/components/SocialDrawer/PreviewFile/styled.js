import styled, { css } from 'styled-components'

import { error } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 256px;
  background-color: #f2f2f2;
  color: #7f7f7f;
  font-size: 1rem;
  margin: 1.5rem 0;
  padding: 0 1.5rem;
  text-align: center;

  .sk-circle {
    margin: 1.5rem 0 !important;
  }
`

const previewStyles = css`
  max-height: 90%;
  max-width: 100%;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.26);
`

export const Image = styled.img`
  ${previewStyles};
`

export const Video = styled.video`
  ${previewStyles};
`

export const Error = styled.div`
  color: ${error};
  font-weight: 500;
`
