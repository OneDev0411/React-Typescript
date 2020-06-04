import styled, { css } from 'styled-components'

import Card from '../Card'
import { grey, primary } from '../../utils/colors'

// modes
const sharedModeStyles = css`
  position: absolute;
  z-index: 1;
  overflow: hidden;
`
const topRightMode = css`
  ${sharedModeStyles}
  top: -8px;
  right: 0;
  transform: translateY(-100%);
`

const topLeftMode = css`
  ${sharedModeStyles}
  top: -8px;
  left: 0;
  transform: translateY(-100%);
`

const bottomLeftMode = css`
  ${sharedModeStyles}
  left: 0;
  top: 3px;
`

const bottomRightMode = css`
  ${sharedModeStyles}
  right: 0;
  top: 3px;
`

// utils
function popUpPositionStyle(props) {
  switch (props.popUpPosition) {
    case 'top-right':
      return topRightMode
    case 'top-left':
      return topLeftMode
    case 'bottom-left':
      return bottomLeftMode
    case 'bottom-right':
      return bottomRightMode
    default:
      return ''
  }
}

// styles
export const PickerContent = styled.div`
  & .picker-actions {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
`

export const PickerContainer = styled(Card)`
  padding: 0.5em;
  ${popUpPositionStyle}

  .DayPicker,
  .DayPicker-wrapper {
    padding: 0;
  }

  .DayPicker-Month {
    margin: 0;
  }

  .DayPicker-Caption {
    height: auto !important;
    border: none !important;
    margin-bottom: 0.5em;

    > div {
      font-size: 1rem;
    }
  }

  .DayPicker-NavButton {
    top: 0;
    width: 24px;
    height: 24px;
    margin: 0;
    padding: 0;
    background-size: 100%;
  }

  .DayPicker-NavButton--next {
    left: auto;
    right: 0;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CiAgPHBhdGggZD0iTTguNTkgMTYuNTlMMTMuMTcgMTIgOC41OSA3LjQxIDEwIDZsNiA2LTYgNi0xLjQxLTEuNDF6Ii8+CiAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgwVjB6Ii8+Cjwvc3ZnPg==');
  }

  .DayPicker-NavButton--prev {
    left: 0;
    right: auto;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CiAgPHBhdGggZD0iTTE1LjQxIDE2LjU5TDEwLjgzIDEybDQuNTgtNC41OUwxNCA2bC02IDYgNiA2IDEuNDEtMS40MXoiLz4KICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDBWMHoiLz4KPC9zdmc+');
  }

  .DayPicker abbr[title],
  .DayPicker abbr[data-original-title] {
    text-decoration: none;
  }

  .DayPicker-NavButton--next:hover,
  .DayPicker-NavButton--prev:hover {
    border-radius: 3px;
    background-color: ${grey.A100};
  }

  .DayPicker-WeekdaysRow {
    background-color: ${grey.A100};
  }

  .DayPicker-Day {
    padding: 0.25em 0.25em;
  }

  .DayPicker .DayPicker-Day--outside:hover {
    background-color: transparent !important;
  }

  .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
    font-weight: normal;
    color: #fff;
    border-radius: 100%;
    background-color: ${primary};

    &:hover {
      background-color: ${primary};
    }
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    color: #fff;
    border-radius: 100%;
    background-color: ${primary};
  }
`
