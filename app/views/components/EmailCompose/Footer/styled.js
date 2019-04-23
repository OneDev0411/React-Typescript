import styled from 'styled-components'

const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

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
