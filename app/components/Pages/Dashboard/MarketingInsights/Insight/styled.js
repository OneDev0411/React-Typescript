import styled from 'styled-components'

import Badge from 'components/Badge'

export const InsightContainer = styled.div`
  display: flex;
  padding: 0 1.5rem 3rem 1.5rem;
  min-height: calc(100vh - 7.5rem);

  & > aside {
    width: 30%;
    margin-right: 1rem;
  }

  & > section {
    width: 70%;
    background: #fff;
    border-radius: 0.18rem;
    border: solid 1px #d4d4d4;
    padding: 1.5rem;
  }
`

export const SummaryCard = styled.div`
  background: #fff;
  border-radius: 0.18rem;
  border: solid 1px #d4d4d4;
  padding: 1.5rem;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    & > li {
      margin-bottom: 1rem;

      .field-name {
        color: #7f7f7f;
        margin-bottom: 0.125rem;
      }
      .field-value {
        font-weight: bold;
      }
    }
  }

  .sent-from {
    position: relative;
    padding: 1rem 0;
    margin-top: 1.5rem;

    & .title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 3rem;
      height: 1px;
      background: #ccc;
      display: block;
      content: '';
    }
  }
`

export const InsightsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
`

export const ContactColumn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 1rem;

  .labels-container {
    & > span {
      margin-left: 0.5rem;
    }
  }
`

export const StyledBadge = styled(Badge)`
  padding: 0.25rem 0.75rem;
`
