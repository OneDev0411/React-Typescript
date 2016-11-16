module.exports = function(props) {
  const website = props.website
  const attributes = website.attributes
  const user = website.user
  const brand = website.brand

  const cover_image = attributes.cover_image || '/images/cover.jpg'
  const profile_image = user.profile_image_url || '/images/profile.png'

  const tagline = attributes.tagline || 'Own a piece of Dallas'

  const twitter_url = attributes.twitter_url || '#'
  const instagram_url = attributes.instagram_url || '#'

  const highlights = attributes.highlights || [
    'Climb Top Producer 2006-2015',
    'Top 1% Of San Francisco Real Estate Agents',
    'Luxury Urban Living (Condos and Lofts)',
    'SOMA/South Beach Resident',
    'Fluent in French'
  ]

  const highlights_cover = attributes.highlights_cover || '/images/boat.jpg'

  const testimonial = attributes.testimonial || 'An unconditional friend who loves kickboxing and is always ready for an adventor.'

  const about_me = attributes.about_me || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

  const facebookIcon = () => {
    if (attributes.facebook_url === null)
      return

    return (
      <a href={attributes.facebook_url}><i className="mdi mdi-mr mdi-md mdi-facebook mdi-social" /></a>
    )
  }

  const twitterIcon = () => {
    if (attributes.twitter_url === null)
      return

    return (
      <a href={attributes.twitter_url}><i className="mdi mdi-mr mdi-md mdi-twitter mdi-social" /></a>
    )
  }

  const instagramIcon = () => {
    if (attributes.instagram_url === null)
      return

    return (
      <a href={attributes.instagram_url}><i className="mdi mdi-mr mdi-md mdi-instagram mdi-social" /></a>
    )
  }

  return (
    <div>
      <meta charSet="utf-8" />
      <title>Home Page</title>
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link rel="stylesheet" href="/styles/styles.css" />
      <meta property="og:description" />
      <meta property="og:type" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" />
      <meta name="twitter:image" content="#{site_url}/dist/img/twitter-card.jpg" />
      <meta name="twitter:site" content="@undefined" />
      <main className="main-page">
        <header className="header">
          <figure className="mast-head" style={{backgroundImage: `url(${cover_image})`}} />
          <figcaption className="mast-head_content container"><img className="img-header" src={profile_image} alt={user.display_name} />
            <div className="content wrapper">
              <h2 className="name">
                {user.display_name}
              </h2>
              <h4 className="text">{tagline}</h4>
              <nav className="properties">
                <a className="meta" href="#">{user.email}</a>
                <a className="meta" href="#">{user.phone_number}</a>
              </nav><a className="btn-blue" href="#" target="_blank"><i className="mdi mdi-mr mdi-md mdi-magnify" />FIND YOUR DREAM HOME WITH ME</a>
              <hr className="line" />
              <div className="social">
                {facebookIcon()}
                {twitterIcon()}
                {instagramIcon()}
              </div>
            </div>
          </figcaption>
        </header>
        <section className="section-highlights">
          <div className="col--md_6 col--sm_12 col--xsm_12">
            <section className="inner-box">
              <h1 className="title-upp">QUICK HIGHLIGHTS</h1>
              <ul className="list-content">
              {
                highlights.map( (h,i) => (
                  <li key={i}><i className="mdi mdi-mr mdi-md mdi-check" />{h}</li>
                ))
              }
              </ul>
            </section>
          </div>
          <div className="col--xsm_12 col--sm_6 col--md_3"><img src={highlights_cover} /></div>
          <div className="col--xsm_12 col--sm_6 col--md_3"><img src={highlights_cover} /></div>
        </section>
        <section className="section-quote">
          <div className="container">
            <div className="row">
              <div className="col--md_6 col--sm_6 col--xsm_12 col-vertical-align_top">
                <blockquote className="quote">
                  <p>"{testimonial}"</p>
                </blockquote>
              </div>
              <div className="col--md_6 col--sm_6 col--xsm_12 col-vertical-align_top">
                <h1 className="title-upp">About {user.display_name}</h1>
                <p className="paragraph">{about_me}</p><a className="line-button" href="http://" target="_blank">VISIT MY WEBSITE<i className="mdi mdi-ml mdi-md mdi-arrow-right" /></a>
              </div>
            </div>
          </div>
        </section>
        <section className="section-lists">
          <header className="section-lists_head">
            <h3 className="section-lists_head-title">Open Houses</h3>
          </header>
          <section className="section-lists_body">
            <div className="container">
              <iframe src="https://irish.rechat.com/widgets/listings?brokerage=CSTPP01" height={500} />
            </div>
          </section>
        </section>
        <section className="section-lists">
          <header className="section-lists_head">
            <h3 className="section-lists_head-title">Active Listings</h3>
          </header>
          <section className="section-lists_body">
            <div className="container">
              <iframe src="https://irish.rechat.com/widgets/listings?brokerage=CSTPP01" height={500} />
            </div>
          </section>
        </section>
        <section className="section-lists">
          <header className="section-lists_head">
            <h3 className="section-lists_head-title">Sold Listings</h3>
          </header>
          <section className="section-lists_body">
            <div className="container">
              <iframe src="https://irish.rechat.com/widgets/listings?brokerage=CSTPP01" height={500} />
            </div>
          </section>
        </section>
      </main>
      <section className="section-partners">
        <div className="container"><a className="section-partners-item" href="#">
          {brand.messages.office_title}
        </a></div>
      </section>
      <footer className="footer">
        <div className="footer-body container"><img className="img-footer" src={profile_image} alt={user.display_name} />
          <h2 className="name">{user.display_name}</h2>
          <nav className="properties">
            <a className="meta" href="#">M: {user.phone_number}</a>,
            <a className="meta" href="#"> E: {user.email}</a></nav>
          <p className="text">Need help looking for the perfect home? I can help you.</p><a className="btn-white" href="http://" target="_blank"><i className="mdi mdi-mr mdi-md mdi-message-outline" />CHAT WITH ME</a>
        </div>
      </footer>
    </div>
  )
}