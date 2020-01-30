import React from 'react'
import { Box, BoxProps } from '@material-ui/core'

import GlobalHeader, { GlobalHeaderProps } from 'components/GlobalHeader'
import GlobalHeaderWithSearch, {
  GlobalHeaderWithSearchProps
} from 'components/GlobalHeaderWithSearch'

interface Props {
  gutter?: number
  children: React.ReactNode
}

const GlobalPageLayout = ({ gutter = 5, children }: Props & BoxProps) => {
  return <Box p={gutter}>{children}</Box>
}

GlobalPageLayout.Header = (props: GlobalHeaderProps) => (
  <GlobalHeader {...props} noPadding />
)
GlobalPageLayout.HeaderWithSearch = (props: GlobalHeaderWithSearchProps) => (
  <GlobalHeaderWithSearch {...props} noPadding />
)

GlobalPageLayout.Main = ({ gutter = 0, ...props }: Props & BoxProps) => (
  <Box p={gutter} mt={5} {...props} />
)

export default GlobalPageLayout
