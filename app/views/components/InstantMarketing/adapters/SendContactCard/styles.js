import Button from '@material-ui/core/Button'
import styled from 'styled-components'

export const BirthdayButton = styled(props => (
  // Here adding inline styles because it is not overriding the styles
  <Button style={{ color: 'black' }} {...props} />
))`
  background: ${({ theme }) => theme.palette.grey[200]};
  &:hover {
    background: ${({ theme }) => theme.palette.grey[300]};
  }
`
