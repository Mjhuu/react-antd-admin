import React, {Component} from 'react';
//懒加载
import Lazyload from 'r-img-lazyload';
import loadingImg from './../../Common/images/lazyload.png'

class LazyloadImg extends Component {
    render() {
        const config = {
            options: {
                error: loadingImg,
                loading: loadingImg
            },
            ...this.props
        };
        return <Lazyload {...config} />;
    }
}

export default LazyloadImg;
