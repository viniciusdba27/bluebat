import React from 'react'
import PropTypes from 'prop-types'
import { Common } from '../../Constants'
import Styles from './styles'

const ENTER = 'Enter'
const INVALID = 'INVALID'
const ALPHA = ' abcdefghijklmnopqrstuvwxyz'
const DELAY = 200

export default class Cell extends React.Component {
  constructor(props) {
    super(props)
    const { x, y, value } = props
    this.state = {
      editing: false,
      value,
    }


    this.display = this.determineDisplay({ x, y }, value)
    this.timer = 0
    this.delay = DELAY
    this.prevent = false
  }

  componentDidMount() {
    window.document.addEventListener('unselectAll', this.handleUnselectAll)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { value, editing, selected } = this.state
    const { value: pValue } = this.props
    if (value !== '' && value.slice(0, 1) === Common.EQUAL) {
      return true
    }

    if (nextState.value !== value ||
        nextState.editing !== editing ||
        nextState.selected !== selected ||
        nextProps.value !== pValue) {
      return true
    }

    return false
  }

  componentWillUpdate() {
    const { x, y } = this.props
    const { value } = this.state
    this.display = this.determineDisplay({ x, y }, value)
  }

  componentWillUnmount() {
    window.document.removeEventListener('unselectAll', this.handleUnselectAll)
  }

  onChange = (e) => {
    const { x, y, updateCells } = this.props
    this.setState({ value: e.target.value })
    this.display = this.determineDisplay({ x, y }, e.target.value)
    updateCells()
  }

  onKeyPressOnInput = (e) => {
    if (e.key === ENTER) {
      this.hasNewValue(e.target.value)
    }
  }

  onKeyPressOnSpan = () => {
    const { editing } = this.state
    if (!editing) {
      this.setState({ editing: true })
    }
  }

  onBlur = (e) => {
    this.hasNewValue(e.target.value)
  }

  handleUnselectAll = () => {
    const { editing, selected } = this.state
    if (selected || editing) {
      this.setState({ selected: false, editing: false })
    }
  }

  hasNewValue = (value) => {
    const { x, y, onChangedValue } = this.props
    onChangedValue(
      { x, y },
      value,
    )
    this.setState({ editing: false })
  }

  emitUnselectAllEvent = () => {
    const unselectAllEvent = new Event('unselectAll')
    window.document.dispatchEvent(unselectAllEvent)
  }

  clicked = () => {
    this.timer = setTimeout(() => {
      if (!this.prevent) {
        this.emitUnselectAllEvent()
        this.setState({ selected: true })
      }
      this.prevent = false
    }, this.delay)
  }


  doubleClicked = () => {
    clearTimeout(this.timer)
    this.prevent = true

    this.emitUnselectAllEvent()
    this.setState({ editing: true, selected: true })
  }

  determineDisplay = ({ x, y }, value) => {
    const { executeFormula } = this.props
    if (value.slice(0, 1) === Common.EQUAL) {
      const res = executeFormula({ x, y }, value.slice(1))
      if (res.error !== null) {
        return INVALID
      }
      return res.result
    }
    return value
  }

  calculateCss = () => {
    const { x, y } = this.props
    let css = {}

    if (x === 0 || y === 0) {
      css = Styles.focus
    }

    return css
  }

  render() {
    const css = this.calculateCss()
    const { selected, value, editing } = this.state
    const { x, y } = this.props

    if (x === 0) {
      return (
        <span style={{ ...Styles.cell, ...css }}>
          {y}
        </span>
      )
    }


    if (y === 0) {
      const alpha = ALPHA.split('')
      return (
        <span onKeyPress={this.onKeyPressOnSpan} style={{ ...Styles.cell, ...css }} role="presentation">
          {alpha[x]}
        </span>
      )
    }

    const cssSelected = selected && Styles.selected

    if (editing) {
      return (
        <input
          style={{ ...Styles.cell, ...css, ...cssSelected }}
          type="text"
          onBlur={this.onBlur}
          onKeyPress={this.onKeyPressOnInput}
          value={value}
          onChange={this.onChange}
          autoFocus
        />
      )
    }
    return (
      <span
        onClick={e => this.clicked(e)}
        onDoubleClick={e => this.doubleClicked(e)}
        style={{ ...Styles.cell, ...css }}
        role="presentation"
      >
        {this.display}
      </span>
    )
  }
}

Cell.propTypes = {
  onChangedValue: PropTypes.func.isRequired,
  executeFormula: PropTypes.func.isRequired,
  updateCells: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
}
