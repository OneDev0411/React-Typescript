import styled from 'styled-components'
import { primary } from 'views/utils/colors'

export const SidebarContainer = styled.div`
  width: 10rem;
`

export const FakeButton = styled.div`
  border-radius: 3px;
  color: #fff;
  font-weight: 500;
  background-color: ${primary};
  height: 2.5em;
  font-size: 1rem;
  line-height: 2.5;
  padding: 0 1rem;
  cursor: pointer;
`

export const DraggableArea = styled.div`
  display: flex;
  flex-direction: column;
  color: #808080;
  font-weight: 400;
  font-size: 0.875rem;
  text-align: center;
`

export const Divider = styled.div`
  border-bottom: dashed 1px #e7e7e7;
  margin: 1.5rem;
`
