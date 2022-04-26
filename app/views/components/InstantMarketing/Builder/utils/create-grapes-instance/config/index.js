export default {
  canvasCss: `
  html {
    background-color: rgb(243, 243, 243);
  }

  body {
    height: auto;
  }

  .gjs-selected {
    outline-offset: 4px;
  }

  .cke_focus {
    outline: none;
  }

  .gjs-comp-selected[data-gjs-type=text] {
    outline-offset: 5px;
  }

  .gjs-comp-selected {
    outline-color: #0945eb !important;
  }

  .gjs-hovered {
    outline: 2px dashed #0945eb !important;
    cursor: pointer;
    outline-offset: 1px;
  }

  .gjs-hovered[data-gjs-type=text] {
    outline-offset: 5px;
  }

  .gjs-dashed *[data-highlightable] {
    outline: none;
  }
  
  *[data-gjs-type="text"][draggable="true"] {
    -webkit-user-select: text;
  }
  `,
  height: '100%',
  parser: {
    optionsHtml: {
      allowScripts: true,
      allowUnsafeAttr: true
    }
  },
  styleManager: {
    textNoElement: '',

    sectors: [
      {
        name: 'Text',
        open: true
        //         buildProps: ['color', 'font-size']
      }
    ],

    appendTo: '.gjs-pn-views-container'
  },
  traitManager: {
    appendTo: '.gjs-pn-views-container'
  },
  blockManager: {
    appendTo: '.gjs-pn-views-container'
  }
}
