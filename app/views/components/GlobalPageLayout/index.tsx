import React from 'react'

import { Box, BoxProps } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import GlobalHeader, { GlobalHeaderProps } from 'components/GlobalHeader'
import GlobalHeaderWithSearch, {
  GlobalHeaderWithSearchProps
} from 'components/GlobalHeaderWithSearch'

interface Props extends BoxProps {
  gutter?: number
  children: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) => ({
  layout: { backgroundColor: theme.palette.background.default }
}))

const GlobalPageLayout = ({ gutter = 4, ...props }: Props) => {
  const classes = useStyles()

  return (
    <Box
      id="GlobalPageLayout"
      p={gutter}
      height="100%"
      display="flex"
      flexDirection="column"
      className={classes.layout}
      {...props}
    />
  )
}

GlobalPageLayout.Header = (props: GlobalHeaderProps) => (
  <GlobalHeader {...props} noPadding />
)
GlobalPageLayout.HeaderWithSearch = ({
  noPadding = true,
  ...props
}: GlobalHeaderWithSearchProps) => (
  <GlobalHeaderWithSearch {...props} noPadding={noPadding} />
)

GlobalPageLayout.Main = ({ gutter = 0, ...props }: Props) => (
  <Box
    id="GlobalPageLayoutMain"
    p={gutter}
    mt={5}
    display="flex"
    flexDirection="column"
    flexGrow={1}
    {...props}
  />
)

export default GlobalPageLayout
