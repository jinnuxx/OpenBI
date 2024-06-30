import { request } from '@umijs/max';
import { useEffect, useState } from 'react';
import {Typography,Button, Col, Divider, Input, Modal, Row, Card} from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';
import { HeartFilled, HeartOutlined, StarFilled, StarOutlined, WarningOutlined, LeftOutlined } from '@ant-design/icons';

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


const ContentPost = () => {
  const { id } = useParams(); // 从路由参数中获取帖子的 id
  const [post,setPost] = useState(''); // Add this line
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [hearted, setHearted] = useState(false);
  const [favorited, setFavorited] = useState(false); // Add this line
  const [showButtons, setShowButtons] = useState(false);
  const location = useLocation();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [open, setOpen] = useState(false);

  const { Title } = Typography;

  const handleDelete = async () => {
    try {
      const postId = Number(id); // 尝试将字符串转换为数字
      const response = await deletePostUsingPOST({ id: postId });
      console.log('Post deleted successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    try {
      const tagsArray = newPostTags.split(','); // 将逗号分隔的标签字符串转换为字符串数组
      if (id !== undefined) {
        const postId = Number(id); // 尝试将字符串转换为数字
        // console.log(id);
        // console.log(postId);
        const response = await editPostUsingPOST({ id: id, title: newPostTitle, tags: tagsArray, content: newPostContent });
        console.log('Post edited successfully');
      }

    } catch (error) {
      console.error(error);
    }
  };

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
        data: { postId: id,
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
        data: { postId: id }, // 确保正确传递数据到后端
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
        data: { id: id }, // 确保正确传递数据到后端
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
        const response = await request(`/api/post/list/page/vo/`, {
          method: 'POST', // 指定请求方法为 POST
          data: { id: id },
        });
        const post = response.data.records[0];
        setPost(post);
        setPostContent(post.content);
        setPostTitle(post.title);
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

        <Row justify="space-between" align="middle">
          <Col span={4}>
            <Link to="/Resources">
              <Button
                  icon={<LeftOutlined />}
                  >Back</Button>
            </Link>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'right' }}>
              {hearted ? (
                  <Button
                      icon={<HeartFilled />}
                      onClick={handleThumbPost}
                  >
                    Like
                  </Button>
              ) : (
                  <Button
                      icon={<HeartOutlined />}
                      onClick={handleThumbPost}
                  >
                    Like
                  </Button>
              )}
              {favorited ? (
                  <Button
                      style={{ marginLeft: '10px' }}
                      icon={<StarFilled />}
                      onClick={handleFavour}
                  >
                    Favour
                  </Button>
              ) : (
                  <Button
                      style={{ marginLeft: '10px' }}
                      icon={<StarOutlined />}
                      onClick={handleFavour}
                  >
                    Favour
                  </Button>
              )}
              <Button
                  style={{ marginLeft: '10px' }}
                  icon={<WarningOutlined />}
                  onClick={handleReport}
              >
                Report
              </Button>
            </div>
          </Col>

        </Row>
        <br/>
        <Card>
        <h1 style={{ fontSize: '30px', lineHeight: '1.5', margin:"20px",textAlign:'center', fontWeight:'bold',color:'auto' }}>{postTitle}</h1>
        {/*显示发布时间、点赞数、收藏数*/}
        <p style={{ fontSize: '10px', lineHeight: '1.5', marginBottom:"20px",textAlign:'center'}}>
            {/*<span style={{ fontSize: '16px', lineHeight: '1.5' }}>Create Time: {post.createTime}</span>*/}
            <span style={{ fontSize: '16px', lineHeight: '1.5', marginLeft: '10px' }}> {post.thumbNum} Likes</span>
            <span style={{ fontSize: '16px', lineHeight: '1.5', marginLeft: '10px' }}>{post.favourNum} Bookmarks</span>
        </p>

        <Divider/>
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{postContent}</p>
        {/*{showButtons && (*/}
        {/*    <div>*/}
        {/*      <Row justify="end">*/}
        {/*        <Button type="primary" onClick={showModal} style={{ marginBottom: '20px', marginRight: '10px' }}>*/}
        {/*          Edit*/}
        {/*        </Button>*/}
        {/*        <Button style={{ marginRight: '10px', marginBottom: '10px' }} onClick={handleDelete}>Delete</Button>*/}
        {/*      </Row>*/}
        {/*    </div>*/}
        {/*)}*/}
        {/*<Modal title="New Post" visible={open} onOk={handleEdit} confirmLoading={confirmLoading} onCancel={handleCancel}>*/}
        {/*  /!* Input fields go here *!/*/}
        {/*</Modal>*/}
        </Card>
      </div>
  );
};

export default ContentPost;

