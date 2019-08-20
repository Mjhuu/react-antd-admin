import React, {Component} from 'react';

class Error extends Component {
    render() {
        return (
            <div className="unify-outbox">
                <div className="unify-box">
                    <div id="page-404">
                        <section>
                            <h1>404</h1>
                            <p>你要找的页面不存在<a href="/">返回首页</a></p>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}

export default Error;
