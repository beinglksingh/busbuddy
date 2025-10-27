import {connect} from 'react-redux';
import {compose} from 'recompose';

//Actions
//import * as acCalls from "../Feedback/Actions";
import * as commonCalls from "../common-actions";

import withLoadingScreen from '../HOC/spinner';

const mapDispatchToProps = (dispatch) => ({
  callFill_GridData: (data) => dispatch(commonCalls.callFill_GridData(data)),
  callGet_Data: (data) => dispatch(commonCalls.callGet_Data(data)),
  callAdd_Data_Multipart: (data) => dispatch(commonCalls.callAdd_Data_Multipart(data)),
  callEdit_Data_Multipart: (data) => dispatch(commonCalls.callEdit_Data_Multipart(data)),
  callAdd_Data: (data) => dispatch(commonCalls.callAdd_Data(data)),
  callEdit_Data: (data) => dispatch(commonCalls.callEdit_Data(data)),
  callDelete_Data: (data) => dispatch(commonCalls.callDelete_Data(data)),
});

const mapStateToProps = (state) => ({
  isLoading: state.isLoading
//   authData: state.authData,
//   profileData: state.profileData
});

export const container = compose(
  connect(mapStateToProps, mapDispatchToProps),
  // withLoadingScreen,
);
