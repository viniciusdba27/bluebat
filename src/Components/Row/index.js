import React from 'react'
import PropTypes from 'prop-types'
import Cell from '../Cell'

const Row = ({
  x, y, handleChangedCell, updateCells, rowData, executeFormula,
}) => {
  const cells = []

  for (let xi = 0; xi < x; xi += 1) {
    cells.push(<Cell
      key={`${xi}-${y}`}
      y={y}
      x={xi}
      onChangedValue={handleChangedCell}
      updateCells={updateCells}
      value={rowData[x] || ''}
      executeFormula={executeFormula}
    />)
  }
  return (
    <div>
      {cells}
    </div>
  )
}

Row.propTypes = {
  handleChangedCell: PropTypes.func.isRequired,
  executeFormula: PropTypes.func.isRequired,
  updateCells: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  rowData: PropTypes.shape({
    string: PropTypes.string,
  }).isRequired,
}

export default Row
