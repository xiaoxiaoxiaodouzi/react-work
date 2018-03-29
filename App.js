import {connect } from 'react-redux';
import Counter from './reduxTest';

// Map Redux state to component props
function mapStateToProps(state) {
  return {
    value: state.count
  }
}
// Action
const increaseAction = { type: 'increase' };
// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    onIncreaseClick: () => dispatch(increaseAction)
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)

export default App;
