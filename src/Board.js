import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DraggableComponents from './DraggableComponents';

class Board extends Component {
  render() {
    return <DraggableComponents updateComponent={this.props.updateComponent}
                           {...this.props}/>
  }
}

export default DragDropContext(HTML5Backend)(Board)