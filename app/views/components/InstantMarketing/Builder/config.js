export default {
  canvasCss: `
  .gjs-comp-selected {
    outline-color: #003bdf !important;
  }

  .gjs-hovered {
    outline-color: #003bdf !important;
    cursor: pointer;
  }
  `,
  height: '100%',
  styleManager: {
    textNoElement: '',

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
