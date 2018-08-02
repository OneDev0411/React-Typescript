export default {
  height: '100%',
  styleManager: {
    sectors: [
      {
        name: 'Color',
        open: true,
        buildProps: ['background-color', 'color']
      }
    ]
  },
  panels: {
    stylePrefix: 'pn-',
    defaults: [
      {
        id: 'commands',
        buttons: [{}]
      },
      {
        id: 'views',
        buttons: [
          {
            id: 'open-sm',
            className: 'fa fa-paint-brush',
            command: 'open-sm',
            active: true,
            attributes: { title: 'Open Style Manager' }
          }
        ]
      }
    ]
  }
}
