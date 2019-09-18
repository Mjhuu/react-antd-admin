import React from 'react'
import './style.styl'
import PropTypes from 'prop-types';
import {Icon, Avatar, Button} from "antd";
import avatar from './../../Common/images/headImg.png'

class AnimatedBooks extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired, //标题
        description: PropTypes.string.isRequired, // 描述
        background: PropTypes.string, //封面颜色
        url: PropTypes.string.isRequired, //预览地址
        headImg: PropTypes.string.isRequired, //头像地址
        username: PropTypes.string.isRequired, //用户名
        delState: PropTypes.bool.isRequired, //是否显示删除按钮
        onDel: PropTypes.func.isRequired, //删除按钮点击
    };
    static defaultProps = {
        url: '###',
        background: '#13C2C2',
        title: '项目标题',
        description: '项目描述',
        username: '用户名',
        headImg: '',
        delState: true
    };

    render() {
        const { title, description, background, url, className = '', style = {}, headImg, username, delState } = this.props;
        return (
            <div className={`book-container ${className}`} style={style}>
                <div className="book">
                    {/* 封面 */}
                    <ul className="hardcover_front">
                        <li>
                            <div className='cover-box' style={{background}}>
                                <Avatar src={headImg ? headImg : avatar} size="small" icon="user" />
                                <p className="ellipsis">{username}</p>
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
                                {
                                    delState && <Button type="danger" onClick={this.props.onDel}><Icon style={{fontSize: '1.5rem'}} type="rest" /></Button>
                                }
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