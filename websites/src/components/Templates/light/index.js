import React, { Component } from 'react'
import EditBar from '../../Partials/EditBar/'
import Website from '../../../models/Website'
import template from './template.json'
import _ from 'lodash'
import async from 'async'
import S from 'shorti'
if (process.env.NODE_ENV !== 'production')
  require('./assets/styles/light.css')

class Light extends Component {
  constructor() {
    super()
    this.state = {
      data: {
        step: 1,
        outline_color: '1561bd',
        ...template,
        template_width: '100p'
      }
    }
  }
  componentDidMount() {
    this.getWebsite()
    if (typeof window !== 'undefined') {
      window.onresize = () => {
        this.resizeWidth()
      }
    }
  }
  getWebsite() {
    const params = {
      access_token: this.props.location.query.access_token
    }
    Website.get(params, (err, res) => {
      if (err) {
        this.setState({
          data: {
            ...this.state.data,
            website_get_error: true
          }
        })
        return
      }
      // Reset input values in steps
      const steps = this.state.data.steps
      const website = res.data[res.data.length - 1]
      const saved_attributes = website.attributes
      steps.forEach(step => {
        const attributes = step.attributes
        attributes.forEach(attribute => {
          attribute.value = saved_attributes[attribute.key]
        })
      })
      this.setState({
        data: {
          website,
          ...this.state.data,
          attributes: saved_attributes,
          steps: [
            ...steps
          ],
          is_editable: true
        }
      })
    })
  }
  resizeWidth() {
    this.setState({
      data: {
        ...this.state.data,
        template_width: window.innerWidth - 400
      }
    })
  }
  goToStep(step) {
    this.setState({
      data: {
        ...this.state.data,
        step
      }
    })
  }
  editText(key, value) {
    const data = this.state.data
    const steps = data.steps
    const step = steps[data.step - 1]
    const attribute = _.find(step.attributes, { key })
    attribute.value = value
    data.attributes[key] = value
    this.setState({
      data: {
        ...this.state.data
      }
    })
  }
  uploadMedia(key, accepted_files) {
    const data = this.state.data
    const steps = data.steps
    const step = steps[data.step - 1]
    const attribute = _.find(step.attributes, { key })
    const file = accepted_files[0]
    attribute.file = file
    attribute.value = file.preview
    data.attributes[key] = accepted_files[0].preview
    this.setState({
      data: {
        ...this.state.data
      }
    })
  }
  getFiles() {
    const data = this.state.data
    const steps = data.steps
    const attributes = _.flatMap(steps, 'attributes')
    const file_attributes = _.filter(attributes, attribute => { return attribute.type === 'Media' })
    if (file_attributes && file_attributes.length)
      return file_attributes
  }
  saveWebsite() {
    this.setState({
      data: {
        ...this.state.data,
        saving_website: true
      }
    })
    const params = {
      website: {
        template: 'light',
        brand: this.props.location.query.brand,
        attributes: this.state.data.attributes
      },
      access_token: this.props.location.query.access_token
    }
    // Test if files uploaded
    const file_attributes = this.getFiles()
    if (file_attributes) {
      async.eachSeries(file_attributes, (file_attribute, callback) => {
        if (!file_attribute.file)
          return callback()
        const upload_params = {
          file: file_attribute.file,
          access_token: this.props.location.query.access_token
        }
        Website.uploadFiles(upload_params, (err, res) => {
          params.website.attributes[file_attribute.key] = res.url
          callback()
        })
      }, () => {
        const website = this.state.data.website
        // if (website) {
        //   const params = {
        //     website
        //   }
        //   // Edit website
        //   Website.edit(params, (err, res) => {
        //     delete this.state.data.saving_website
        //     if (err) {
        //       this.setState({
        //         data: {
        //           ...this.state.data,
        //           website_save_error: true
        //         }
        //       })
        //       return
        //     }
        //     this.setState({
        //       data: {
        //         ...this.state.data,
        //         website_saved: true
        //       }
        //     })
        //   })
        // } else {
          // Create website
          Website.create(params, (err, res) => {
            delete this.state.data.saving_website
            if (err) {
              this.setState({
                data: {
                  ...this.state.data,
                  website_save_error: true
                }
              })
              return
            }
            this.setState({
              data: {
                ...this.state.data,
                website_saved: true
              }
            })
          })
        // }
        const hostname_params = {
          id: this.state.data.website.id,
          hostname: 'localhost:3000',
          is_default: true,
          access_token: this.props.location.query.access_token
        }
        Website.createHostname(hostname_params, (err, res) => {
          console.log(res)
        })
      })
      return
    }
    Website.save(params, (err, res) => {
      console.log(res)
    })
  }
  render() {
    const data = this.state.data
    let website = data.website
    if (!website)
      website = this.props.website
    if (!website)
      return <div>Loading</div>
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
    let edit_bar
    if (data.is_editable) {
      edit_bar = (
        <EditBar
          data={ data }
          goToStep={ this.goToStep.bind(this) }
          uploadMedia={ this.uploadMedia.bind(this) }
          editText={ this.editText.bind(this) }
          saveWebsite={ this.saveWebsite.bind(this) }
        />
      )
    }
    return (
      <div>
        <main className="main-template" style={ S(`w-${data.template_width} absolute l-0`) }>
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
        { edit_bar }
      </div>
    )
  }
}
module.exports = Light