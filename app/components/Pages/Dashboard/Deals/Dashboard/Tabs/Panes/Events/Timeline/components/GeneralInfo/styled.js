import styled, { css } from 'styled-components'

export const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 500;
  word-break: break-word;

  ${props =>
    props.truncate &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `};

  &:hover {
    color: ${({ theme }) => theme.palette.secondary.main};
    text-decoration: underline;
  }
`

export const Description = styled.p`
  color: ${({ theme }) => theme.palette.grey['900']};
  margin: 0;
`
