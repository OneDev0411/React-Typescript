import Button from '@material-ui/core/Button'
import styled from 'styled-components'

export const BirthdayButton = styled(props => <Button {...props} />)`
  background: ${({ theme }) => theme.palette.grey[200]};
  color: ${({ theme }) => theme.palette.black};
  &:hover {
    background: ${({ theme }) => theme.palette.grey[300]};
  }
`
