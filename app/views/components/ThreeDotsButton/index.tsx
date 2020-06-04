import { createStyles, makeStyles, Theme } from '@material-ui/core'

import * as React from 'react'

import { forwardRef, HTMLProps } from 'react'

import classNames from 'classnames'

import { ClassesProps } from 'utils/ts-utils'

const styles = (theme: Theme) =>
  createStyles({
    toggleButton: {
      padding: theme.spacing(0, 0.75),
      lineHeight: 0,
      fontFamily: 'Times',
      fontSize: '1.8rem',
      letterSpacing: '-1.5px',
      textIndent: '-3.5px',
      display: 'inline-block',
      height: '0.87rem',
      backgroundColor: theme.palette.grey['200'],
      '&:hover': {
        backgroundColor: theme.palette.grey['300']
      },
      color: theme.palette.grey['800'],
      borderRadius: theme.shape.borderRadius * 2,
      cursor: 'pointer'
    }
  })
const useStyles = makeStyles(styles, { name: 'Collapsible' })

type Props = ClassesProps<typeof styles> & HTMLProps<HTMLElement>

export const ThreeDotsButton = forwardRef<HTMLElement, Props>(
  function ThreeDotsButton(props: Props, ref) {
    const classes = useStyles()

    const className = classNames(classes.toggleButton, props.className)

    return (
      <span {...props} className={className} ref={ref}>
        ...
      </span>
    )
  }
)
