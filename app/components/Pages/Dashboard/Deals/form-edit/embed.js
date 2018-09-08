import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Frame from 'views/components/Deals/EmbedFormEdit'
import IconDocument from 'views/components/SvgIcons/Document/IconDocument'
import ActionButton from 'components/Button/ActionButton'
import TextIconButton from 'components/Button/TextIconButton'
import { H1 } from 'components/Typography/headings'
import IconButton from 'components/Button/IconButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

const SaveButton = ActionButton.extend`
  margin: 0 1em;
`

export default ({
  task,
  incompleteFields,
  buttonCaption,
  loaded,
  saving,
  onSave,
  onClose,
  handleOpenPreview,
  onFrameRef,
  onReceiveMessage
}) => (
  <div className="deal-edit-form">
    <div className="header">
      <H1>{task.title}</H1>

      <div>
        {loaded && (
          <TextIconButton
            appearance="outline"
            iconLeft={IconDocument}
            onClick={handleOpenPreview}
            text="Preview PDF"
          />
        )}

        {saving || !loaded ? (
          <span style={{ marginRight: '20px' }}>
            <i className="fa fa-spin fa-spinner" />&nbsp;
            {buttonCaption}
          </span>
        ) : (
          <SaveButton onClick={onSave}>
            {incompleteFields.length === 0 ? 'Save' : 'Save Draft'}
          </SaveButton>
        )}

        <IconButton iconSize="XLarge" inverse isFit onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
    </div>

    <Row>
      <Col md={12} sm={12} xs={12} style={{ overflow: 'none' }}>
        <Frame
          formId={task.form}
          frameRef={onFrameRef}
          onReceiveMessage={onReceiveMessage}
        />
      </Col>
    </Row>
  </div>
)
