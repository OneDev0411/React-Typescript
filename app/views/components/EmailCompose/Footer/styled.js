import styled from 'styled-components'

const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & .featuresList {
    dispay: flex;
    flex-wrap: nowrap;
    align-content: strech;
  }

  & .actionBar {
    display: flex;
    align-items: center;

    & .scheduled-on {
      font-size: 14px;
      margin-right: 20px;
    }

    & button {
      margin-left: 4px;
    }
  }
`
export { FooterContainer }
