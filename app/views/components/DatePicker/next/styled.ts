import styled from 'styled-components'

export const Container = styled.div`
  --rdp-accent-color: #000;
  --rdp-accent-color-dark: ${({ theme }) => theme.palette.primary.main};
  --rdp-background-color-dark: ${({ theme }) => theme.palette.primary.main};
  --rdp-outline: 1px solid var(--rdp-accent-color);
  --rdp-background-color: ${({ theme }) => theme.palette.secondary.main};

  .rdp-button:hover {
    color: #fff;
  }

  .rdp-button:focus {
    color: #fff;
    border: none;
  }

  .rdp-day_selected:focus:not([aria-disabled='true']) {
    border: none;
  }

  .rdp-day_selected:not([aria-disabled='true']) {
    background-color: #000;
    color: #fff;
  }
`
