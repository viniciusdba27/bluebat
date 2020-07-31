import { Colors } from '../../Theme'

const styles = {
  cell: {
    width: '80px',
    padding: '4px',
    margin: '0',
    height: '25px',
    boxSizing: 'border-box',
    position: 'relative',
    display: 'inline-block',
    color: 'black',
    border: `1px solid ${Colors.borderColor}`,
    textAlign: 'left',
    verticalAlign: 'top',
    fontSize: '14px',
    lineHeight: '15px',
    overflow: 'hidden',
    fontFamily: 'Calibri, \'Segoe UI\', Thonburi, Arial, Verdana, sans-serif',
  },
  selected: {
    outlineColor: Colors.outlineColor,
    utlineStyle: 'dotted',
  },
  focus: {
    textAlign: 'center',
    backgroundColor: Colors.backgroundColor,
    fontWeight: 'bold',
  },
}
export default styles
