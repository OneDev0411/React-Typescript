import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import { Uploader } from 'components/Uploader'

import Fetch from '../../../../../services/fetch'

const CUSTOM_ASSET_UPLOAD_PATH = '/templates/assets'

const run = async () => {
  const grapesjs = await loadGrapes()
  const Backbone = await import('backbone' /* webpackChunkName: "backbone" */)

  grapesjs.plugins.add('asset-blocks', editor => {
    let target

    const getStorageData = async key =>
      new Promise(res => {
        editor.StorageManager.load(key, data => res(data))
      })

    const AssetView = Backbone.View.extend({
      events: {
        click: 'onClick'
      },
      onClick() {
        const url = this.model.get('image')

        const setSrc = () => target.set('src', url)
        const setBg = () => {
          const style = Object.assign({}, target.get('style'))

          style['background-image'] = `url(${url})`
          target.set('style', style)
        }

        const setters = {
          image: setSrc,
          cell: setBg,
          text: setBg,
          '': setBg
        }

        const type = target.get('type')

        setters[type]()
      },
      initialize({ model }) {
        this.model = model
      },
      render() {
        this.$el.html(
          `<img src="${this.model.get(
            'image'
          )}" style="margin: 8px 3% 8px 5%; border-radius: 2px; width: 90%; cursor: pointer;"/>`
        )

        return this
      }
    })

    const AssetUploadButtonView = Backbone.View.extend({
      render() {
        ReactDOM.render(
          <Uploader
            accept="image/*"
            uploadHandler={async files => {
              const { templateId } = await getStorageData('templateId')

              try {
                const uploadResponses = await Promise.all(
                  files.map(file =>
                    new Fetch()
                      .upload(CUSTOM_ASSET_UPLOAD_PATH)
                      .attach('attachment', file, file.name)
                      .field('template', templateId)
                  )
                )

                const uploadedAssets = uploadResponses.map(response => ({
                  previewUrl: response.body.data.file.preview_url,
                  url: response.body.data.file.url
                }))

                const uploadedAssetsCollection = uploadedAssets.map(asset => ({
                  image: asset.url
                }))

                view.collection.reset([
                  ...uploadedAssetsCollection,
                  ...view.collection.models
                ])
              } catch (e) {
                console.error(e)
              }
            }}
          >
            <Fragment>Click or drop images here</Fragment>
          </Uploader>,
          this.el
        )

        return this
      }
    })

    const AssetsView = Backbone.View.extend({
      initialize({ coll }) {
        this.collection = coll
        this.listenTo(this.collection, 'reset', this.reset)
      },
      reset() {
        this.$el.empty()

        const uploadButtonView = new AssetUploadButtonView()

        uploadButtonView.render()
        uploadButtonView.$el.appendTo(this.el)

        this.collection
          .filter(asset => {
            const imgListing = asset.attributes.listing
            const selectedListing =
              target && target.attributes.attributes['rechat-listing']

            return (
              !imgListing || !selectedListing || imgListing === selectedListing
            )
          })
          .forEach(asset => {
            const view = new AssetView({ model: asset })

            view.render()
            view.$el.appendTo(this.el)
          })
      },
      render: () => this
    })

    const view = new AssetsView({
      coll: editor.AssetManager.getAll()
    })

    view.render()
    view.$el.hide()

    const pn = editor.Panels
    const id = 'views-container'
    const panels = pn.getPanel(id) || pn.addPanel({ id })

    editor.on('load', () => {
      panels.set('appendContent', view.$el).trigger('change:appendContent')
    })

    editor.on('component:selected', selected => {
      const attributes = selected.get('attributes')

      if (!attributes || !attributes['rechat-assets']) {
        view.$el.hide()

        return false
      }

      target = selected
      view.reset()
      view.$el.show()
    })
  })

}

run()