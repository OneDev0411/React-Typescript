import styled from 'styled-components'

export const MenuContainer = styled.div`
  position: relative;
`

export const MenuButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  padding: 0 10px;
  color: ${props => (props.isPlaceholder ? '#aaa' : '#262626')};
`

export const MenuContent = styled.div`
  position: absolute;
  left: 0;
  top: 37px;
  width: 100%;
  height: 276px;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
`

export const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 16px 10px 16px;
  padding: 0 8px;
  border: 1px solid #dfe7ec;
  border-radius: 4px;
  overflow: hidden;
`

export const SearchInput = styled.input`
  width: 100%;
  height: 30px;
  padding: 0 5px;
  border: none;
  :focus {
    outline: none;
  }
`

export const List = styled.div`
  min-height: 170px;
  max-height: 170px;
  overflow: auto;
  border: 1px solid #d7dfe4;
  border-left: none;
  border-right: none;
  border-top: ${props => (props.showSearchInput ? '' : 'none')};
  border-bottom: ${props => (props.showCallToActions ? '' : 'none')};
`

export const ListItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: ${props => (props.selected ? 500 : 400)};

  :hover {
    background-color: #eee;
  }

  ${props =>
    props.disabled &&
    `
    cursor: not-allowed;
    color: gray;
  `};
`

export const CallToActions = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  height: 50px;
  padding: 0 16px;
`
