import React from "react";
import PropTypes from "prop-types";
import { Parser as FormulaParser } from "hot-formula-parser";
import Row from "../Row";
import { Common } from "../../Constants";

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    const { x: pX, y: pY, id } = props;
    this.state = {
      data: {},
    };

    this.tableIdentifier = `tableData-${id}`;

    this.parser = new FormulaParser();

    this.parser.on("callCellValue", (cellCoord, done) => {
      const x = cellCoord.column.index + 1;
      const y = cellCoord.row.index + 1;

      if (x > pX || y > pY) {
        throw this.parser.Error(this.parser.ERROR_NOT_AVAILABLE);
      }

      if (this.parser.cell.x === x && this.parser.cell.y === y) {
        throw this.parser.Error(this.parser.ERROR_REF);
      }

      if (!this.state.data[y] || !this.state.data[y][x]) {
        return done("");
      }

      return done(this.state.data[y][x]);
    });

    this.parser.on("callRangeValue", (startCellCoord, endCellCoord, done) => {
      const sx = startCellCoord.column.index + 1;
      const sy = startCellCoord.row.index + 1;
      const ex = endCellCoord.column.index + 1;
      const ey = endCellCoord.row.index + 1;
      const fragment = [];

      for (let y = sy; y <= ey; y += 1) {
        const row = this.state.data[y];
        if (!row) {
          continue;
        }

        const colFragment = [];

        for (let x = sx; x <= ex; x += 1) {
          let value = row[x];
          if (!value) {
            value = "";
          }

          if (value.slice(0, 1) === Common.EQUAL) {
            const res = this.executeFormula({ x, y }, value.slice(1));
            if (res.error) {
              throw this.parser.Error(res.error);
            }
            value = res.result;
          }

          colFragment.push(value);
        }
        fragment.push(colFragment);
      }

      if (fragment) {
        done(fragment);
      }
    });
  }

  componentWillMount() {
    const { saveToLocalStorage } = this.props;
    if (saveToLocalStorage && window && window.localStorage) {
      const data = window.localStorage.getItem(this.tableIdentifier);
      if (data) {
        // antipattern
        this.setState({ data: JSON.parse(data) });
      }
    }
  }

  updateCells = () => {
    this.forceUpdate();
  };

  executeFormula = (cell, value) => {
    this.parser.cell = cell;
    let res = this.parser.parse(value);
    if (res.error != null) {
      return res;
    }
    if (res.result.toString() === "") {
      return res;
    }
    if (res.result.toString().slice(0, 1) === Common.EQUAL) {
      res = this.executeFormula(cell, res.result.slice(1));
    }

    return res;
  };

  handleChangedCell = ({ x, y }, value) => {
    const { saveToLocalStorage } = this.props;
    const modifiedData = Object.assign({}, this.state.data);
    if (!modifiedData[y]) modifiedData[y] = {};
    modifiedData[y][x] = value;
    this.setState({ data: modifiedData });

    if (saveToLocalStorage && window && window.localStorage) {
      window.localStorage.setItem(
        this.tableIdentifier,
        JSON.stringify(modifiedData)
      );
    }
  };

  render() {
    const { x: pX, y: pY } = this.props;
    const rows = [];

    for (let y = 0; y < pY + 1; y += 1) {
      const rowData = this.state.data[y] || {};
      rows.push(
        <Row
          handleChangedCell={this.handleChangedCell}
          executeFormula={this.executeFormula}
          updateCells={this.updateCells}
          key={y}
          y={y}
          x={pX + 1}
          rowData={rowData}
        />
      );
    }
    return <div>{rows}</div>;
  }
}

Table.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  id: PropTypes.string,
  saveToLocalStorage: PropTypes.bool,
};

Table.defaultProps = {
  saveToLocalStorage: true,
  id: "default",
};
