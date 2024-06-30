import {
    HeartOutlined,
    LogoutOutlined,
    ReadOutlined,
    SettingOutlined,
    StopOutlined,
    UserOutlined
} from '@ant-design/icons';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {history, useModel} from '@umijs/max';
import {Spin} from 'antd';
import {stringify} from 'querystring';
import type {MenuInfo} from 'rc-menu/lib/interface';
import React, {useCallback, useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import {userLogoutUsingPOST} from "@/services/openbi/userController";
import Settings from '../../../config/defaultSettings';

export type GlobalHeaderRightProps = {
    menu?: boolean;
    children?: React.ReactNode;
};

export const AvatarName = () => {
    const {initialState} = useModel('@@initialState');
    const {currentUser} = initialState || {};
    return <span className="anticon">{currentUser?.userName}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({menu, children}) => {
    const [darkMode, setDarkMode] = useState(false); // add darkMode state
    /**
     * 退出登录，并且将当前的 url 保存
     */
    const loginOut = async () => {
        const {search, pathname} = window.location;
        const urlParams = new URL(window.location.href).searchParams;
        /** 此方法会跳转到 redirect 参数所在的位置 */
        const redirect = urlParams.get('redirect');

        // 调用退出登录的方法
        try {
            // 调用退出登录的方法
            await userLogoutUsingPOST();

            // 设置cookie中的userId字段为空
            document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT';

            if (window.location.pathname !== '/user/login' && !redirect) {
                history.replace({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: pathname + search,
                    }),
                });
            }
        } catch (error) {
            console.error('退出登录时出错', error);
        }
    };
    const actionClassName = useEmotionCss(({token}) => {
        return {
            display: 'flex',
            height: '48px',
            marginLeft: 'auto',
            overflow: 'hidden',
            alignItems: 'center',
            padding: '0 8px',
            cursor: 'pointer',
            borderRadius: token.borderRadius,
            '&:hover': {
                backgroundColor: token.colorBgTextHover,
            },
        };
    });
    const {initialState, setInitialState} = useModel('@@initialState');

    const onMenuClick = useCallback(
        (event: MenuInfo) => {
            const {key} = event;
            if (key === 'logout') {
                flushSync(() => {
                    setInitialState((s) => ({...s, currentUser: undefined}));
                });
                loginOut();
                return;
            } else if (key === 'MyPostList') {
                // 跳转到资源页面并只显示当前用户的帖子
                // return history.push('/Resources?userId=' + currentUser.id); // 将当前用户的ID作为参数传递
                return history.push('/post/myPosts');

            }else if(key === 'MyFavourList'){
                return history.push('/post/myFavours');
            }
            else if(key === 'darkMode'){
                if (Settings.navTheme === 'light') {
                    Settings.navTheme = 'realDark';
                    Settings.colorPrimary = '#1890ff';
                    setDarkMode(true); // switch darkMode
                    sessionStorage.setItem('darkMode', 'realDark'); // save darkMode
                } else {
                    Settings.navTheme = 'light';
                    Settings.colorPrimary = '#1677FF';
                    setDarkMode(false);
                    sessionStorage.setItem('darkMode', 'light');
                }
                history.replace(window.location.pathname);
                //history.go(0); // reload page
            }
            if (key === 'profile') {
                return history.push({
                    pathname: '/profile'
                });
            }
            if(key !== 'darkMode'){
                history.push(`/account/${key}`);
            }
        },
        [history, setInitialState],
    );

    useEffect(() => {
        const savedMode = sessionStorage.getItem('darkMode');
        if(savedMode === null){
            console.log("null")
            Settings.navTheme = 'light';
            Settings.colorPrimary = '#1677FF';
            console.log(Settings.navTheme)
            setDarkMode(false);
        }
        if(savedMode === 'realDark'){
            console.log("Real dark")
            Settings.navTheme = 'realDark';
            Settings.colorPrimary = '#1890ff';
            console.log(Settings.navTheme)
            setDarkMode(true); // switch darkMode
        }else{
            console.log("light")
            Settings.navTheme = 'light';
            Settings.colorPrimary = '#1677FF';
            console.log(Settings.navTheme)
            setDarkMode(false);
        }
    }
    )

    const loading = (
        <span className={actionClassName}>
      <Spin
          size="small"
          style={{
              marginLeft: 8,
              marginRight: 8,
          }}
      />
    </span>
    );

    if (!initialState) {
        return loading;
    }

    const {currentUser} = initialState;
    console.log(currentUser)
    if (!currentUser || !currentUser.id) {
        console.log(currentUser)
        return loading;
    }

    const menuItems = [
        ...(menu
            ? [
                {
                    key: 'center',
                    icon: <UserOutlined/>,
                    label: '个人中心',
                },
                {
                    key: 'settings',
                    icon: <SettingOutlined/>,
                    label: '个人设置',
                },
                {
                    type: 'divider' as const,
                },
            ]
            : []),
        {
            key: 'MyPostList',
            icon: <ReadOutlined/>,
            label: 'My Posts',
        },
        {
          key:'MyFavourList',
          icon: <HeartOutlined/>,
            label: 'My Favours',
        },
        {
            key: 'profile',
            icon: <SettingOutlined/>,
            label: 'Edit Profile'
        },
        {
            key: 'darkMode',
            icon: <StopOutlined/>,
            label: darkMode ? 'Light Mode' : 'Dark Mode', // 动态显示 Dark Mode 或 Light Mode
        },
        {
            key: 'logout',
            icon: <LogoutOutlined/>,
            label: 'Log out',
        },
    ];

    return (
        <HeaderDropdown
            menu={{
                selectedKeys: [],
                onClick: onMenuClick,
                items: menuItems,
            }}
        >
            {children}
        </HeaderDropdown>
    );
};
