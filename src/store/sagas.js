import { all, fork } from 'redux-saga/effects';

//public
import AccountSaga from './auth/register/saga';
import AuthSaga from './auth/login/saga';
import ForgetSaga from './auth/forgetpwd/saga';
import LayoutSaga from './layout/saga';
import ProfileSaga from "./auth/profile/saga"
import dashboardSaga from "./dashboard/saga";
import dashboardSaasSaga from "./dashboard-saas/saga";
//
import {commonActionWatcher} from "./common-saga"

export default function* rootSaga() {
    yield all([
        //public
        fork(AccountSaga),
        fork(AuthSaga),
        fork(ForgetSaga),
        fork(ProfileSaga),
        fork(LayoutSaga),
        fork(dashboardSaga),
        fork(dashboardSaasSaga),
        fork(commonActionWatcher)
    ])
}