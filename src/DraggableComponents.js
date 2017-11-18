import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import ComponentBox from './ComponentBox'

const style = {
  height: '300px',
  margin:'0 1rem',
  boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)',
  position: 'relative',
}

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x)
    const top = Math.round(item.top + delta.y)

    component.moveBox(item.id, left, top)
  }
}

class DraggableComponents extends Component {

  moveBox(id, left, top) {
    this.props.updateComponent(id, left, top);
  }

  render() {
    const { connectDropTarget } = this.props;
    const { boxes = []} = this.props;


    return connectDropTarget(
      <div style={style}>
        {boxes.map(({ id, left, top, type, score }) => {
          return (
            <ComponentBox key={id}
                id={id}
                type={type}
                left={left}
                top={top}>
              {score}
            </ComponentBox>
          )
        })}
      </div>
    )
  }
}

DraggableComponents.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
}

export default DropTarget(ItemTypes.BOX, boxTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(DraggableComponents);