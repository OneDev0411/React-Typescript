import { grey } from 'views/utils/colors'

// we don't have an alias for the app, so I just tried to use one of the aliases and don't introduce a new alias until we fix the aliases
import { theme } from 'theme'

export default {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
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
    paddingLeft: theme.spacing(19),
    color: grey.A900,
    overflow: 'hidden',
    whiteSpace: 'nowrap' as 'nowrap',
    textOverflow: 'ellipsis'
  },
  time: {
    width: '6.5rem',
    fontSize: '1rem',
    letterSpacing: '0.25px',
    color: grey.A900
  },
  link: {
    cursor: 'pointer'
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: '100%',
    marginRight: '1rem'
  }
}
