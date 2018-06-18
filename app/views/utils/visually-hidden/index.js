import styled from 'styled-components'

export function setVisuallyHidden(element) {
  return styled[element]`
    ${props =>
      props.state && props.state === 'undo'
        ? `position: static;
    overflow: visible;
    width: auto;
    height: auto;
    margin: auto;
    clip: auto;`
        : `border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;`};
  `
}
