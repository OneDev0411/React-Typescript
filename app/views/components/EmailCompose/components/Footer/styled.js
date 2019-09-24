import styled from 'styled-components'

const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing(2, 0)};
  border-top: 1px solid ${props => props.theme.palette.divider};
  flex: 0 0 auto;
  & .features-list {
    dispay: flex;
    flex-wrap: nowrap;
    align-content: strech;
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
export { FooterContainer }
