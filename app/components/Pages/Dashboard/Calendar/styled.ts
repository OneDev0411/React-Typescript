import styled from 'styled-components'

import { hexToRgb } from 'utils/hex-to-rgb'
import { primary, grey } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;

  .DayPicker-Day--today {
    color: #fff !important;
    background-color: ${primary} !important;
    font-weight: 500 !important;
  }

  .DayPicker-Day--selected {
    color: ${primary} !important;
    background-color: rgba(${hexToRgb(primary).join(',')}, 0.14) !important;

    :hover {
      color: #fff !important;
    }
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):not(.DayPicker-Day--empty):hover {
    color: #262626;
    background-color: rgba(${hexToRgb(primary).join(',')}, 0.8) !important;
  }

  .DayPicker-Day--empty {
    color: #ccc;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
  padding: 0 1.5rem 0 0;
  border-bottom: 1px solid #eff1f2;
  margin-bottom: 1rem;
`

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 18rem;
  background: ${grey.A100};
  padding: 1rem 0.5rem;
`

export const SideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  margin-bottom: 1rem;
`

export const Title = styled.div`
  font-weight: 900;
  font-size: 1.2rem;
  line-height: 2rem;
  color: #1f2e4d;
`

export const Main = styled.div`
  width: calc(100% - 18rem);
`

export const ListContainer = styled.div`
  margin: 0 1.5rem;
`
