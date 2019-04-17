import styled from 'styled-components'

export const TimeInputContainer = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid #ccc;
  box-shadow: inset 0 1px 1px #f5f5f5;
  padding: 4px;

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
      opacity: 0;
      height: 1em;
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
