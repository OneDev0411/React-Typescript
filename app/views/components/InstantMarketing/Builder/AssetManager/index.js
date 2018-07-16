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

  const AssetsView = Backbone.View.extend({
    initialize({ coll }) {
      this.listenTo(coll, 'reset', this.reset)
      this.listenTo(coll, 'add', this.add)
      this.listenTo(coll, 'remove', this.remove)

      this.collection = coll
    },
    reset() {
      console.log('Reseting')
      this.$el.html('')
    },
    add(asset) {
      console.log('Added', asset)
    },
    remove(asset) {
      console.log('Removed', asset)
    },
    render: () => this
  })

  const view = new AssetsView({})

  view.render()
  view.$el.hide()

  const pn = editor.Panels
  const id = 'views-container'
  const panels = pn.getPanel(id) || pn.addPanel({ id })

  editor.on('load', () => {
    panels.set('appendContent', view.$el).trigger('change:appendContent')
  })

  editor.on('component:selected', () => {
    view.$el.show()
  })
})
