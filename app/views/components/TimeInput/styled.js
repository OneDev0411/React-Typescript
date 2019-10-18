import styled from 'styled-components'

export const TimeInputContainer = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid #ccc;
  box-shadow: inset 0 1px 1px #f5f5f5;
  padding: 4px;
  overflow: hidden;

  & .time,
  & .meridian {
    position: relative;

    & > label {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      margin: 0;
      font-weight: normal;
      text-align: center;
    }
    & > input:focus + label {
      background: #b3d6fb;
      border-radius: 3px;
    }

    & > input {
      height: 1em;
      opacity: 0;
      width: 0;
    }
  }

  & .time {
    width: 1.3em;
  }
  & .meridian {
    width: 1.7em;
  }

  & .icon,
  & .icon svg {
    width: 16px;
    height: 16px;
    line-height: 0;
    display: block;
  }

  & .icon {
    margin-left: 4px;
  }
`
