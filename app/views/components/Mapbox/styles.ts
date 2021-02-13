import { makeStyles } from '@material-ui/core'

export interface StyleProps {
  width?: string | number
  height?: string | number
}

export default makeStyles({
  root: ({ width = '100%', height = 250 }: StyleProps) => ({
    width,
    height
  })
})
