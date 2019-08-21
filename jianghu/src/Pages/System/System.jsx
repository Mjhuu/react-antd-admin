import React, {Component} from 'react';
import Typing from './../../Components/Typing/Typing'

class System extends Component {
    render() {
        return (
            <div>
                <Typing>
                    系统信息设置
                    <p>
                        版本<code>3.9.0 </code>
                    </p>
                </Typing>
            </div>
        );
    }
}

export default System;
