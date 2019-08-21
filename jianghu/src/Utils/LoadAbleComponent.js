import React from 'react'
import Loadable from 'react-loadable'
import Loading from './../Components/Loading/Loading'


/**
 * 异步加载组件
 * @param {*} component
 * @param {*} haveLoading  组件加载时是否有loading效果
 */
const LoadableComponent = (component, haveLoading = false) => {
    return Loadable({
        loader: () => component,
        loading: (props) => {
            if (props.error) {
                return <div>资源加载失败</div>;
            } else if (props.timedOut) {
                return <div>服务器响应超时，请检查你的网络是否正常，或者刷新此界面。</div>;
            } else if (props.pastDelay && haveLoading) {
                return <Loading />
            } else {
                return null;
            }
        },
        delay: 200,
        timeout: 15000, // 15 seconds
    })
};

export default LoadableComponent