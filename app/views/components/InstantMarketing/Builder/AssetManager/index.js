import grapesjs from 'grapesjs'
import Backbone from 'backbone'

export default grapesjs.plugins.add('asset-blocks', editor => {
  const domc = editor.DomComponents
  const defaultType = domc.getType('default')

  const defaultModel = defaultType.model
  const defaultView = defaultType.view

  domc.addType('listing-image', {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          tagName: 'div',
          draggable: true,
          droppable: true
        }
      },
      {
        isComponent(el) {
          if (el.tagName == 'DIV' && el.classList.contains('listing-image')) {
            console.log('Returning LISTING IMAGE')

            return { type: 'listing-image' }
          }
        }
      }
    ),
    view: defaultView
  })

  const bm = editor.BlockManager

  bm.add('listing-image', {
    label: `
    <div class="gjs-block-label">Listing Image</div>`,
    content: `
      <div class="listing-image">Foo</div>
    `
  })

  let target
  const AssetView = Backbone.View.extend({
    events: {
      click: 'onClick',
    },
    onClick() {
      target.set('src', this.model.get('src'))
    },
    initialize({ model }) {
      this.model = model
    },
    render() {
      this.$el.html(`<img src="${this.model.get('src')}" width="100%" />`)
      return this
    }
  })

  const AssetsView = Backbone.View.extend({
    initialize({ coll }) {
      this.collection = coll
    },
    reset() {
      this.$el.empty()
      for(let i = 0; i<this.collection.length; i++) {
        const asset = this.collection.at(i)
        const view = new AssetView({model:asset})
        view.render()
        view.$el.appendTo(this.el)
      }
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
    if (selected.get('type') !== 'image') {
      view.$el.hide()
      return
    }

    target = selected
    view.reset()
    view.$el.show()
  })
})
