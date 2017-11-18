import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes'

const boxSource = {
  beginDrag(props) {
    const { id, left, top } = props
    return { id, left, top }
  }
}

class ComponentBox extends Component {
  render() {
    const {
      left,
      top,
      type,
      connectDragSource,
      isDragging,
      children
    } = this.props
    if (isDragging) {
      return null
    }

    const style = { left, top, position: 'absolute' };
    style.background = {
      'device': '#36b096',
      'venue': '#ed6a5a',
      'cloud': '#339ed6',
      'gateway': '#662382',
      'application': '#f6a623'
    }[type] || 'black';
    return connectDragSource(
      <div  className="component-box" style={style}>{children}</div>
    )
  }
}

ComponentBox.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  id: PropTypes.any.isRequired,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  children: PropTypes.node
}

export default DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(ComponentBox);