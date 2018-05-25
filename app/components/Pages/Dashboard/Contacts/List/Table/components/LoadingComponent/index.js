import React from 'react'
import styled from 'styled-components'

import Loading from '../../../../../../../Partials/Loading'

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 2em;
  bottom: 0;
  opacity: ${props => (props.loading ? 1 : 0)};
  z-index: ${props => (props.loading ? 2 : -1)};
  pointer-events: ${props => (props.loading ? 'all' : 'none')};
  will-change: opacity;
  transition: opacity 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
`

export function LoadingComponent(props) {
  return (
    <Container {...props}>
      <Loading style={{ marginTop: '1.5em' }} />
    </Container>
  )
}

// function MyLoader() {
//   return (
//     <ContentLoader height={30}>
//       {/* Pure SVG */}
//       <circle cx="30" cy="10" r="10" />
//       <rect x="50" y="2" rx="4" ry="4" width="300" height="6" />
//       <rect x="50" y="14" rx="4" ry="4" width="250" height="6" />
//     </ContentLoader>
//   )
// }

// function LoaderList(props) {
//   const content = []

//   for (let i = 0; i < 13; i++) {
//     content.push(<MyLoader key={i} />)
//   }

//   return <Container {...props}>{content}</Container>
// }

// export function LoadingComponent(props) {
//   if (!props.loading) {
//     return null
//   }

//   return <LoaderList {...props} />
// }
