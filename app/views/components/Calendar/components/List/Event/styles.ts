import { makeStyles } from '@material-ui/styles'

interface Props {
  hasBorderBottom: boolean | null
}

export default makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
    transition: '0.1s ease-in background-color',
    borderBottom: (props: Props) =>
      props.hasBorderBottom ? '1px solid #dbe6fd' : 'none',
    '&:hover': {
      borderRadius: '2px',
      backgroundColor: '#f6f6f6',
      cursor: 'pointer'
    }
  },
  time: {
    width: '9rem',
    fontSize: '1rem',
    letterSpacing: '0.25px',
    color: '#536280'
  }
})
