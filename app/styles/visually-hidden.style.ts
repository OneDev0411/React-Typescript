import { createStyles, makeStyles, Theme } from '@material-ui/core'

interface Props {
  state?: 'undo'
}

export const useVisuallyHiddenStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: (props: Props) =>
        props.state === 'undo'
          ? {
              position: 'static',
              overflow: 'visible',
              width: 'auto',
              height: 'auto',
              margin: 'auto',
              clip: 'auto'
            }
          : {
              border: 0,
              clip: 'rect(0 0 0 0)',
              height: 1,
              width: 1,
              margin: '-1px!important',
              overflow: 'hidden',
              padding: 0,
              position: 'absolute'
            }
    }),
  { name: 'visuallyHidden' }
)
