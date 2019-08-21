import styled from 'styled-components'

export const SideNavContainer = styled.div`
  width: 13rem;
  background-color: ${props => props.theme.palette.grey[100]};
  padding-left: ${props => props.theme.spacing(1)}px;
  padding-top: ${props => props.theme.spacing(2)}px;
  padding-bottom: ${props => props.theme.spacing(2)}px;
  overflow-y: scroll;

  h6 {
    padding-left: ${props => props.theme.spacing(2)}px;
    margin-bottom: ${props => props.theme.spacing(2)}px;
    font-weight: 500;
  }

  section {
    margin-bottom: ${props => props.theme.spacing(5)}px;
  }

  .section-item {
    border-radius: 1.25rem 0 0 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: unset;
    height: ${props => props.theme.spacing(5)}px;
    text-decoration: none;

    &:focus {
      outline: none;
    }
  }

  .section-item.is-selected {
    background: rgba(9, 69, 235, 0.12);
    color: ${props => props.theme.palette.primary.main};

    & > span {
      font-weight: 500;
    }

    &:hover {
      background: rgba(9, 69, 235, 0.12);
    }

    .section-item__icon > svg {
      fill: ${props => props.theme.palette.primary.main};
    }
  }

  .SideNav-direct-child {
    padding: 0 ${props => props.theme.spacing(2)}px;
  }
`
