import { makeStyles, Typography, TypographyProps } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import './animations.css'

const useStyles = makeStyles(
  () => ({
    container: ({ animation }: { animation: Animation | null }) => {
      return animation
        ? {
            ...animation
          }
        : {}
    }
  }),
  {
    name: 'TextTransition'
  }
)

interface Animation {
  'animation-name': React.CSSProperties['animationName']
  'animation-duration': React.CSSProperties['animationDuration']
  'animation-iteration-count': React.CSSProperties['animationIterationCount']
  'animation-timing-function': React.CSSProperties['animationTimingFunction']
}

interface Props extends TypographyProps {
  text: string
  duration?: number
  repeat?: number
  animationName?: 'flash'
  timingFunction?: string
}

export function TextTransition({
  text,
  duration = 1,
  repeat = 1,
  animationName = 'flash',
  timingFunction = 'linear',
  ...typographyProps
}: Props) {
  const [animation, setAnimation] = useState<Animation | null>(null)
  const classes = useStyles({ animation })

  useEffect(() => {
    setAnimation({
      'animation-name': animationName,
      'animation-duration': `${duration}s`,
      'animation-iteration-count': repeat,
      'animation-timing-function': timingFunction
    })

    setTimeout(() => {
      setAnimation(null)
    }, duration * repeat * 1000)
  }, [text, animationName, duration, repeat, timingFunction])

  return (
    <Typography {...typographyProps} className={classes.container}>
      {text}
    </Typography>
  )
}
