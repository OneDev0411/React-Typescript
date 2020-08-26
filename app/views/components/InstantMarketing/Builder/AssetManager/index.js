import React from 'react'
import ReactDOM from 'react-dom'

import { Uploader } from 'components/Uploader'
import uploadAsset from 'models/instant-marketing/upload-asset'

import { AppTheme } from '../../../../../AppTheme'

import { AssetImage } from './AssetImage'

import { loadGrapesjs } from '../utils/load-grapes'

export const load = async () => {
  const { Grapesjs, Backbone } = await loadGrapesjs()

  Grapesjs.plugins.add('asset-blocks', async editor => {
    let target

    const getStorageData = async key =>
      new Promise(res => {
        editor.StorageManager.load(key, data => res(data))
      })

    const AssetView = Backbone.View.extend({
      initialize({ model }) {
        this.model = model
      },
      render() {
        ReactDOM.render(
          <AppTheme>
            <AssetImage
              model={this.model}
              target={target}
              getTemplateId={() => getStorageData('templateId')}
            />
          </AppTheme>,
          this.el
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
              try {
                const { templateId } = await getStorageData('templateId')

                const uploadResponses = await Promise.all(
                  files.map(file => uploadAsset(file, templateId))
                )

                const uploadedAssets = uploadResponses.map(response => ({
                  previewUrl: response.body.data.file.preview_url,
                  url: response.body.data.file.url
                }))

                const listing =
                  target.attributes.attributes['rechat-listing'] || null
                const isStatic =
                  target.attributes.attributes['rechat-assets'] != null

                const uploadedAssetsCollection = uploadedAssets.map(asset => ({
                  image: asset.url,
                  listing,
                  static: isStatic,
                  userFile: true
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
            <>Click or drop images here</>
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

        if (!target) {
          return false
        }

        let collection = []

        const type = target.attributes.attributes['rechat-assets']

        if (type === 'listing-image') {
          collection = this.collection.filter(asset => {
            const listing = target.attributes.attributes['rechat-listing']

            if (asset.attributes.avatar) {
              return false
            }

            return !listing || asset.attributes.listing === listing
          })
        } else if (type === 'avatar') {
          collection = this.collection.filter(
            asset => asset.attributes.userFile || asset.attributes.avatar
          )
        } else if (type === 'static') {
          collection = this.collection.filter(asset => asset.attributes.static)
        }

        collection.forEach(asset => {
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

    editor.on('component:remove', () => {
      view.$el.empty()
    })
  })
}
