import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

import Badge from 'components/Badge'
import { grey } from 'views/utils/colors'

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const InsightContainer = styled.div`
  display: flex;
  padding: 0 1.5rem 3rem 1.5rem;
  min-height: calc(100vh - 7.5rem);

  & > .sidebar {
    width: 25%;
    margin-right: 1rem;
  }

  & > .content {
    flex-grow: 1;
  }
`

export const SummaryCard = styled.div`
  max-width: 100%;
  background: #fff;
  border-radius: 0.18rem;
  border: solid 1px ${grey.A300};
  padding: 1.5rem;
  overflow: hidden;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    & > li {
      margin-bottom: 1rem;

      .field-name {
        color: ${(props: ThemeProps<Theme>) => props.theme.palette.grey['600']};
        font-size: ${(props: ThemeProps<Theme>) =>
          props.theme.typography.subtitle2.fontSize};
        font-weight: ${(props: ThemeProps<Theme>) =>
          props.theme.typography.subtitle2.fontWeight};
        margin-bottom: 0.125rem;
      }
      .field-value {
        font-size: ${(props: ThemeProps<Theme>) =>
          props.theme.typography.body2.fontSize};
        font-weight: ${(props: ThemeProps<Theme>) =>
          props.theme.typography.body2.fontWeight};
      }
    }
  }

  .sent-from {
    position: relative;
    padding: 1rem 0;
    margin-top: 1.5rem;

    & .title {
      font-size: ${(props: ThemeProps<Theme>) =>
        props.theme.typography.subtitle1.fontSize};
      font-weight: 'bold';
      margin-bottom: 1.5rem;
    }

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: #ccc;
      display: block;
      content: '';
    }
  }
`

export const ContactColumn = styled.div`
  display: block;
  padding-right: 1rem;

  .labels-container {
    & > span {
      margin-left: 0.5rem;
    }
  }
`
export const NoContent = styled.div`
  display: flex;
  height: 20vh;
  color: ${({ theme }) => theme.palette.text.hint};
  justify-content: center;
  align-items: center;
`
export const StyledBadge = styled(Badge)`
  padding: 0.25rem 0.75rem;
` as typeof Badge
