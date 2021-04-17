import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    deck: {
      '& > *': {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 1,
        transition: theme.transitions.create(['transform', 'opacity']),
        pointerEvents: 'none',
        width: '100%'
      },
      '&$fadeOut > :nth-child(1)': {
        transform: 'translateY(-16px) scale(1.058)',
        opacity: 0
      },
      '& > :nth-child(1)': {
        position: 'relative',
        zIndex: 4,
        pointerEvents: 'auto',
        transform: 'scale(1)'
      },
      '& > :nth-child(2)': {
        transform: 'translateY(16px) scale(0.942)',
        zIndex: 3
      },
      '& > :nth-child(3)': {
        transform: 'translateY(32px) scale(0.885)',
        zIndex: 2
      },
      '& > :nth-child(4)': {
        transform: 'translateY(48px) scale(0.828)',
        zIndex: 1
      },
      '& > :nth-child(5)': {
        transform: 'translateY(48px) scale(0.771)',
        zIndex: 1
      },
      '& > :nth-child(6)': {
        transform: 'translateY(48px) scale(0.714)',
        zIndex: 1
      }
    },
    fadeOut: {}
  }),
  { name: 'CardStack' }
)
