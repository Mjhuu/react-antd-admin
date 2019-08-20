import {put, takeEvery} from 'redux-saga/effects'
import * as constants from './actionTypes'
import * as ajax from './../Api/index'

function* reqAdminInfo(obj) {
    // let data = yield ajax.getGeneralData();
    // const generalData = data.data;
    let {age, gender} = obj;
    yield put({//异步转同步
        type: constants.GET_ADMIN_INFO,
        adminInfo: {
            username: '牟江湖',
            age, gender, token: 'e3242qdaw232'
        }
    })
}
function* mySaga() {
    yield takeEvery(constants.REQ_ADMIN_INFO, reqAdminInfo);
}

export default mySaga;