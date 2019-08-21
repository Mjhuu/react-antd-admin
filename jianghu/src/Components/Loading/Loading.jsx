import React, {Component} from 'react';

import './css/index.styl'

class Loading extends Component {
    render() {
        return (
            <div className="loading-box">
                Loading ……
            </div>
        );
    }
    componentDidMount() {
        console.log('loading');
    }
}

export default Loading;
