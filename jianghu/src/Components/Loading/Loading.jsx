import React, {Component} from 'react';

import './css/index.styl'

class Loading extends Component {
    render() {
        return (
            <div className="loading-box">
                <i>Loading ……</i>
            </div>
        );
    }
    componentDidMount() {
        console.log('loading');
    }
}

export default Loading;
