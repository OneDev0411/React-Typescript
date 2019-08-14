export default {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1rem',
    transition: '0.1s ease-in background-color',
    width: '100%'
  },
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: '1rem',
    fontWeight: 500
  },
  subtitle: {
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: '0.25px',
    paddingLeft: '9.5rem',
    color: '#6a7589',
    overflow: 'hidden',
    whiteSpace: 'nowrap' as 'nowrap',
    textOverflow: 'ellipsis'
  },
  time: {
    width: '6.5rem',
    fontSize: '1rem',
    letterSpacing: '0.25px',
    color: '#536280'
  }
}
