import { Helmet } from 'react-helmet'

import PageLayout from 'components/GlobalPageLayout'

import Welcome from './Welcome'

function OverviewDashboard() {
  return (
<<<<<<< HEAD
    <PageLayout padding={0}>
      <PageLayout.HeaderWithBackground title="Home" />
      <PageLayout.Main mt={4}>
        <Welcome />
      </PageLayout.Main>
    </PageLayout>
=======
    <>
      <Helmet>
        <title>Rechat | Home</title>
      </Helmet>
      <PageLayout padding={0}>
        <PageLayout.HeaderWithBackground title="Home" />
        <PageLayout.Main mt={4}>
          <Welcome />
        </PageLayout.Main>
      </PageLayout>
    </>
>>>>>>> fcb91453c274e571a3e4c6faad480c3bbe87772e
  )
}

export default OverviewDashboard
