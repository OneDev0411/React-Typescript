import styled from 'styled-components'

export const FooterContainer = styled.div`
  position: relative;
`
export const FooterInnerContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing(1, 2)};
  border-top: 1px solid ${props => props.theme.palette.divider};
  position: relative;
  background-color: ${props => props.theme.palette.background.paper};
  z-index: 2; // to be shown over the drawer when it's animating in
  flex: 0 0 auto;
  & .features-list {
    display: flex;
    flex-wrap: nowrap;
  }

  & .action-bar {
    display: flex;
    align-items: center;

    & .scheduled-on {
      font-size: 14px;
      margin-right: 20px;
    }

    & button {
      margin-left: 2px;
    }
  }
`
