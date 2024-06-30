import {history, request} from '@umijs/max';

import {useEffect, useState} from 'react';
import {Typography, Button, Col, Divider, Input, Modal, Row, Card, message} from 'antd';
import {Link, useLocation, useParams} from 'react-router-dom';
import {
    DeleteOutlined,
    EditOutlined,
    HeartFilled,
    HeartOutlined,
    StarFilled,
    StarOutlined,
    WarningOutlined,
    LeftOutlined
} from '@ant-design/icons';

import {
    addPostUsingPOST,
    deletePostUsingPOST,
    editPostUsingPOST, //user update
    getPostVOByIdUsingGET, //get post by id
    listPostVOByPageUsingPOST,
    listMyPostVOByPageUsingPOST,
    searchPostVOByPageUsingPOST,
    updatePostUsingPOST, //admin update
} from '@/services/openbi/postController';
import TextArea from 'antd/lib/input/TextArea';
import {getLoginUserUsingGET} from "@/services/openbi/userController";


const MyPostContent = () => {
    const {id} = useParams(); // 从路由参数中获取帖子的 id
    const [postContent, setPostContent] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postTags, setPostTags] = useState('');
    const [hearted, setHearted] = useState(false);
    const [favorited, setFavorited] = useState(false); // Add this line
    const [showButtons, setShowButtons] = useState(false);
    const location = useLocation();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const {Title} = Typography;
    const { TextArea } = Input;


    const handleDelete = async () => {
        //弹出确认框
        Modal.confirm({
            title: 'Are you sure to delete this post?',
            icon: <WarningOutlined/>,
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deletePost();
                //跳转回我的帖子页面，不用window
                // window.location.href = '/post/myPosts';
                history.push('/post/myPosts');
            }
        });

    };

    const deletePost = async () => {
        try {
            const postId = id; // 获取要删除的帖子的 ID
            const response = await deletePostUsingPOST({id: postId});
            if (response && response.data === true) {
                // 删除成功
                console.log('Post deleted successfully');
                message.success('Post deleted successfully');
                // 返回到我的帖子页面并且刷新页面
                // 等待 1 秒后刷新页面
                setTimeout(() => {
                    history.push('/post/myPosts');
                }
                , 2000);

            } else {
                console.error('Failed to delete the post');
            }
        } catch (error) {
            console.error(error);
        }
    }


    const handleEdit = async () => {
        try {
            //如果postTags不包含逗号，就返回一个元素的数组，如果包含逗号，就返回多个元素的数组
            const tagsArray = postTags.includes(',') ? postTags.split(',') : postTags;

            if (id !== undefined) {
                const postId = id;
                const response = await editPostUsingPOST({
                    id: postId,
                    title: postTitle,
                    tags: tagsArray,
                    content: postContent,
                });
                console.log("response" + response)
                if (response && response.data === true) {
                    // 更新成功
                    console.log('Post updated successfully');
                    message.success('Post updated successfully');
                    setOpen(false);
                } else {
                    console.error('Failed to update the post');

                }

            }
        } catch (error) {
            console.error(error);
        }
    }


    const handleOk = () => {
        //setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    function getCookieValue(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // 检查cookie是否以指定的名称开头
            if (cookie.startsWith(name + '=')) {
                // 返回cookie值（用户的ID）
                return cookie.substring(name.length + 1);
            }
        }
        // 如果找不到指定的cookie，返回null或适当的默认值
        return null;
    }

    // 在组件加载时获取用户的点赞状态
    const checkThumbStatus = async () => {
        try {
            const response = await request('/api/search_thumb', {
                method: 'POST',
                data: {
                    postId: id,
                },
            });
            console.log(response);
            // 如果后端返回1，将爱心状态设置为实心
            if (response.data === 1) {
                setHearted(true);
            }
        } catch (error) {
            console.error('Error checking thumb status:', error);
        }
    };

    //在组件加载时获取用户的收藏状态
    const checkFavourStatus = async () => {
        try {
            const response = await request('/api/post_favour/searchFavour', {
                method: 'POST',
                data: {
                    postId: id,
                },
            });
            console.log(response);
            // 如果后端返回1，将收藏状态设置为实心
            if (response.data === 1) {
                setFavorited(true);
            }
        } catch (error) {
            console.error('Error checking favour status:', error);
        }
    }

    const handleThumbPost = async () => {
        try {
            // 发起 POST 请求到后端的 /api/post_thumb/ 接口并传递 id
            const response = await request(`/api/post_thumb/`, {
                method: 'POST', // 指定请求方法为 POST
                data: {
                    postId: id,
                },
            });
            console.log(response); // 这里可以处理后端的响应
            // 当用户点击后，切换按钮状态
            setHearted(!hearted);
        } catch (error) {
            console.error('Error thumbing post:', error);
        }
    };

    const handleFavour = async () => {
        try {
            const response = await request('/api/post_favour/', {
                method: 'POST',
                // headers: {
                //   'Content-Type': 'application/json',
                // },
                data: {postId: id}, // 确保正确传递数据到后端
            });
            console.log('Favour action completed');
            // 当用户点击后，切换按钮状态
            setFavorited(!favorited);
        } catch (error) {
            console.error(error);
        }
    };


    const handleReport = async () => {
        try {
            const response = request<API.BaseResponseLong_>('/api/post/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {id: id}, // 确保正确传递数据到后端
            });
            console.log('Report action completed');
        } catch (error) {
            console.error(error);
        }
    };


    const showModal = () => {
        setOpen(true);
    };

    function getUserIdFromURL() {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('userId');
    }

    useEffect(() => {
        const urlUserId = getUserIdFromURL();
        // 从cookie中获取用户的ID
        const currentUserId = getCookieValue('userId'); // 假设您已经定义了获取当前用户ID的函数

        if (urlUserId === currentUserId) {
            //if (currentUserId) {
            setShowButtons(true);
            console.log("我的帖子");
        } else {
            setShowButtons(false);
            console.log("公共帖子");
        }

        // 根据帖子的 id 发起 POST 请求获取帖子内容
        const fetchPostContent = async () => {
            try {
                const response = await request(`/api/post/get/vo?id=${id}`, {
                    method: 'GET', // 使用 GET 请求
                });
                console.log("response" + response)
                const post = response.data; // 使用 response.data.data 获取帖子数据
                setPostContent(post.content);
                setPostTitle(post.title);
                setPostTags(post.tagList); // 使用 post.tagList 设置标签
                console.log("post:", post.title); // 输出标签信息
            } catch (error) {
                console.error('Error fetching post content:', error);
            }
        };

        // 在组件加载时获取用户的点赞状态
        checkThumbStatus();
        checkFavourStatus();

        fetchPostContent();
    }, [id, location]);

    return (
        <div>
            {/*<br/>*/}
            <Row justify="space-between" align="middle">
                <Col span={4}>
                    <Link to="/post/myPosts">
                        <Button
                            icon={<LeftOutlined/>}
                        >Back</Button>
                    </Link>
                </Col>
                <Col span={12}>
                    <div style={{textAlign: 'right'}}>
                        <Button
                            icon={<EditOutlined />}
                            onClick={showModal}
                            style={{marginBottom: '20px', marginRight: '10px'}}
                        >
                            Edit
                        </Button>

                        <Button
                            icon={<DeleteOutlined/>}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>

                    </div>

                </Col>


            </Row>

            <br/>
            <Card>
            <h1 style={{fontSize: '25px', lineHeight: '1.5', margin: "20px", textAlign: 'center', fontWeight: 'bold'}}>{postTitle}</h1>
            <Divider/>
            <p style={{fontSize: '16px', lineHeight: '1.5'}}>{postContent}</p>
            {/*{showButtons && (*/}
            {/*    <div>*/}
            {/*        <Row justify="end">*/}
            {/*            <Button type="primary" onClick={showModal} style={{marginBottom: '20px', marginRight: '15px'}}>*/}
            {/*                Edit*/}
            {/*            </Button>*/}
            {/*            <Button style={{marginRight: '10px', marginBottom: '10px'}}*/}
            {/*                    onClick={handleDelete}>Delete</Button>*/}
            {/*        </Row>*/}
            {/*    </div>*/}
            {/*)}*/}
            <Modal title="Edit Post" visible={open} onOk={handleEdit} confirmLoading={confirmLoading}
                   onCancel={handleCancel}>
                <Input
                    type="text"
                    style={{marginBottom: '10px'}}
                    placeholder="Title"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                />
                <Input
                    type="text"
                    style={{marginBottom: '10px'}}
                    placeholder="Tags"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                />
                <TextArea
                    showCount
                    maxLength={8192}
                    style={{height: 120, resize: 'none', marginBottom: '10px'}}
                    placeholder="Content.."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                />
            </Modal>

            </Card>
        </div>
    );
};

export default MyPostContent;

