import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
`

export const RolesMenuContainer = styled.div`
  position: absolute;
  left: 12px;
  top: 30px;
  width: 200px;
  max-height: 200px;
  overflow: auto;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  cursor: auto;
`

export const RolesMenu = styled.ul`
  padding: 0;
  margin: 10px;
`

export const RolesMenuItem = styled.li`
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    color: #2196f3;
  }
`
