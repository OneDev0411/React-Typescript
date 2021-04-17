import { useState, ReactNode } from 'react'
import classNames from 'classnames'
import { Box, Typography, useTheme } from '@material-ui/core'

import useSafeDispatch from 'hooks/use-safe-dispatch'

import { CardStackContext } from './context'

import useStyles from './styles'

interface ChildrenRenderProp {
  pop: () => void
}

interface CardStackProps {
  title: string
  onFadeOut: () => void
  children: ReactNode | (({ pop }: ChildrenRenderProp) => ReactNode)
}

function CardStack({ title, onFadeOut, children }: CardStackProps) {
  const classes = useStyles()
  const theme = useTheme()
  const [isFadingOut, setIsFadingOut] = useState(false)

  const setStateSafe = useSafeDispatch(setIsFadingOut)
  const onFadeOutSafe = useSafeDispatch(onFadeOut)

  const pop = () => {
    setIsFadingOut(true)
    setTimeout(() => {
      onFadeOutSafe()
      setStateSafe(false)
    }, theme.transitions.duration.standard)
  }

  return (
    <Box width="100%">
      <Typography variant="subtitle1">{title}</Typography>
      <Box
        width="100%"
        position="relative"
        className={classNames(
          classes.deck,
          isFadingOut ? classes.fadeOut : undefined
        )}
      >
        <CardStackContext.Provider value={pop}>
          {typeof children === 'function' ? children({ pop }) : children}
        </CardStackContext.Provider>
      </Box>
    </Box>
  )
}

export default CardStack
export { default as useCardStackActions } from './use-card-stack-actions'
