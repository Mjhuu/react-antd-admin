import React from 'react'
import './style.styl'
import PropTypes from 'prop-types';
import {Icon} from "antd";

class AnimatedBooks extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired, //标题
        description: PropTypes.string.isRequired, // 描述
        background: PropTypes.string, //封面颜色
        url: PropTypes.string.isRequired, //预览地址
    };
    static defaultProps = {
        url: '###',
        background: '#13C2C2',
        title: '项目标题',
        description: '项目描述'
    };

    render() {
        const { title, description, background, url, className = '', style = {} } = this.props;
        return (
            <div className={`book-container ${className}`} style={style}>
                <div className="book">
                    {/* 封面 */}
                    <ul className="hardcover_front">
                        <li>
                            <div className='cover-box' style={{background}}>
                                <h3 className='title ellipsis'>{title}</h3>
                                <p className='ellipsis'>{description}</p>
                            </div>
                        </li>
                        <li/>
                    </ul>
                    {/* 书页 */}
                    <ul className="page">
                        <li/>
                        <li>
                            <div className='content-box'>
                                <div className='btn'>
                                    <a href={url} target='_blank' rel="noopener noreferrer"><Icon type="github" /> </a>
                                    <a href={url} target='_blank' rel="noopener noreferrer">预览地址</a>
                                </div>
                            </div>
                        </li>
                        <li/>
                        <li/>
                        <li/>
                    </ul>
                    {/* 背面 */}
                    <ul className="hardcover_back">
                        <li/>
                        <li/>
                    </ul>
                </div>
            </div>
        )
    }
}

export default AnimatedBooks