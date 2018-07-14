const osm = 'open-sm';

module.exports = {
  styleManager: {
    sectors: [
      {
        name: 'Font',
        open: true,
        buildProps: [
          'font-family',
          'font-size',
          'font-weight',
          'letter-spacing',
          'line-height',
          'text-align'
        ],
        properties: [
          {
            property: 'text-align',
            list: [
              { value: 'left', className: 'fa fa-align-left' },
              { value: 'center', className: 'fa fa-align-center' },
              { value: 'right', className: 'fa fa-align-right' },
              { value: 'justify', className: 'fa fa-align-justify' }
            ]
          },

          {
            property: 'font-family',
            list: [
              { value: 'Arial', name: 'Arial' },
              { value: 'Times New Roman', name: 'Times New Roman' },
            ]
          }
        ]
      },
      {
        name: 'Color',
        open: true,
        buildProps: [
          'background-color',
          'color',
        ]
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
            id: osm,
            className: 'fa fa-paint-brush',
            command: osm,
            active: true,
            attributes: { title: 'Open Style Manager' }
          }
        ]
      }
    ]
  }
}