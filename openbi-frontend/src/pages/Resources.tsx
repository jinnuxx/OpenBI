import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {request} from '@umijs/max';
import {
    addPostUsingPOST,
    deletePostUsingPOST,
    editPostUsingPOST,
    getPostVOByIdUsingGET,
    listPostVOByPageUsingPOST,
    listMyPostVOByPageUsingPOST,
    searchPostVOByPageUsingPOST,
    updatePostUsingPOST,
} from '@/services/openbi/postController';
import {Pagination, Button, Modal, Input, Row, Col, Card, Tag, Divider, message, Tooltip} from 'antd';
import {Link, useLocation} from 'react-router-dom';

// Import SearchPost component
import SearchPost from '../pages/Post/SearchPost';
import {listMyFavourPostByPageUsingPOST} from "@/services/openbi/postFavourController";
import {PageContainer} from '@ant-design/pro-components';
import {ClearOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';

interface Post {
    id: number;
    title: string;
    content: string;
    tagList: string[];
    thumbNum: number;
    favourNum: number;
    userId: number;
    createTime: Date;
    updateTime: Date;
    isDelete: number;
    isReport: number;
}

const {TextArea} = Input;

const Resources = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const [posts, setPosts] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostTags, setNewPostTags] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [searchedPosts, setSearchedPosts] = useState([]); // State to hold searched posts

    const [currentPage, setCurrentPage] = useState(1); // 当前页数
    const [pageSize, setPageSize] = useState(10); // 每页显示数量
    const [totalPosts, setTotalPosts] = useState(0); // 总帖子数


    const [searchQuery, setSearchQuery] = useState('');


    const [filterOptions, setFilterOptions] = useState({
        tags: [], // 根据标签筛选
        // title: '', // 根据标题筛选
        // content: '', // 根据内容筛选
        // isFavorite: false, // 是否收藏
        // isLiked: false, // 是否点赞
    });

    const handleFilterChange = (filterType, value) => {
        setFilterOptions({...filterOptions, [filterType]: value});
    };

    const handlePageChange = (page, pageSize) => {
        // 处理分页变化事件
        setCurrentPage(page);
        setPageSize(pageSize);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userId) {
                    // viewMyPost();
                } else {
                    const response = await listPostVOByPageUsingPOST({
                        current: currentPage,
                        pageSize: pageSize,
                        // searchText: searchQuery,
                        ...filterOptions, // 传递筛选选项
                    });
                    if (response.data.code === 0) {
                    } else {
                        const formattedPosts = response.data.records.map((item) => ({
                            id: item.id,
                            title: item.title,
                            content: item.content,
                            thumbNum: item.thumbNum,
                            favourNum: item.favourNum,
                            userId: item.userId,
                            createTime: item.createTime,
                            updateTime: item.updateTime,
                            isReport: item.isReport,
                            tagList: item.tagList,
                        }));
                        setPosts(formattedPosts);
                        setTotalPosts(response.data.total); // 设置总帖子数
                        console.log(formattedPosts);
                    }
                }
            } catch (error) {
                // Handle error
                console.error('Error fetching posts:', error);
            }
        };

        fetchData();
    }, [userId, currentPage, pageSize]); // 添加 currentPage 和 pageSize 作为依赖

    const showModal = () => {
        setOpen(true);
    };

    const viewMyPost = async () => {
        try {
            const response = await listMyPostVOByPageUsingPOST({current: 1, pageSize: 10}); // 传递当前用户的ID或其他必要信息
            //setShowButtons(true); // 用户点击了 "View My Post" 按钮后显示编辑和删除按钮
            if (response.data.code === 0) {

            } else {
                // 处理获取帖子失败的情况
                const formattedPosts = response.data.records.map((item) => ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    thumbNum: item.thumbNum,
                    favourNum: item.favourNum,
                    userId: item.userId,
                    createTime: item.createTime,
                    updateTime: item.updateTime,
                    //isDelete: item.isDelete,
                    isReport: item.isReport,
                    tagList: item.tagList,
                }));
                setPosts(formattedPosts); // 使用 setPosts 函数来设置状态
                console.log("view my post 7777");
            }
        } catch (error) {
            console.error(error);
        }
    };



    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const handleAdd = async () => {
        try {
            const tagsArray = newPostTags.split(',');
            const response = await addPostUsingPOST({title: newPostTitle, tags: tagsArray, content: newPostContent});
            console.log('Post added successfully');

            // 刷新帖子列表
            const refreshResponse = await listPostVOByPageUsingPOST({current: currentPage, pageSize: pageSize});
            if (refreshResponse.data.code === 0) {
                // 处理刷新数据失败的情况
            } else {
                const formattedPosts = refreshResponse.data.records.map((item) => ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    thumbNum: item.thumbNum,
                    favourNum: item.favourNum,
                    userId: item.userId,
                    createTime: item.createTime,
                    updateTime: item.updateTime,
                    isReport: item.isReport,
                    tagList: item.tagList,
                }));
                setPosts(formattedPosts); // 更新帖子列表
                setTotalPosts(refreshResponse.data.total); // 更新总帖子数
                console.log(formattedPosts);
            }

            // 清空输入框
            setNewPostTitle('');
            setNewPostTags('');
            setNewPostContent('');

            setOpen(false); // 关闭 Modal
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await listPostVOByPageUsingPOST({
                current: currentPage,
                pageSize: pageSize,
                searchText: searchQuery,
                ...filterOptions, // 传递筛选选项
            });

            if (response.data.code === 0) {
                // 处理空搜索结果或错误
            } else {
                const formattedPosts = response.data.records.map((item) => ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    thumbNum: item.thumbNum,
                    favourNum: item.favourNum,
                    userId: item.userId,
                    createTime: item.createTime,
                    updateTime: item.updateTime,
                    isReport: item.isReport,
                    tagList: item.tagList,
                }));
                setPosts(formattedPosts);
                setTotalPosts(response.data.total);
            }
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    };


    const filterByTag = async (tag: string) => {
        try {
            //把tag转换成数组，也就是这种格式["xxx","xxx"
            const tagsArray = tag.split(',');
            setFilterOptions({...filterOptions, tags: tagsArray});

            const response = await listPostVOByPageUsingPOST({
                current: 1,
                pageSize: pageSize,
                searchText: searchQuery,
                tags: tagsArray, // 传递筛选选项
            });

            if (response.data.code === 0) {
                // 处理空搜索结果或错误
            } else {
                const formattedPosts = response.data.records.map((item) => ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    thumbNum: item.thumbNum,
                    favourNum: item.favourNum,
                    userId: item.userId,
                    createTime: item.createTime,
                    updateTime: item.updateTime,
                    isReport: item.isReport,
                    tagList: item.tagList,
                }));
                setPosts(formattedPosts);
                setTotalPosts(response.data.total);
                message.success('Filter By "'+ tagsArray + '" Success!')
            }
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    }

    return (
        <PageContainer
            ghost
            header={{
                title: 'Resources',
                breadcrumb: {},
                style: {textAlign: 'center'},
            }}>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    // onSearch={handleSearch}
                    // 按下回车键
                    onPressEnter={handleSearch}
                    allowClear={true}
                    // size="large"
                    style={{ flex: 1 }} // 让输入框自动扩展以占据剩余空间
                />
                <Tooltip title="Clear Filter"><Button
                    icon={<ClearOutlined />}
                    onClick={() => {
                        setFilterOptions({ ...filterOptions, tags: [] });
                        setSearchQuery('');
                        setCurrentPage(1);
                        setPageSize(10);
                        message.success('Clear Filter Success!')
                        // 重新搜索
                        // handleSearch();

                    }}
                    style={{ marginLeft: '8px' }}
                >

                </Button></Tooltip>
                <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                    />
                </div>
            </div>



            {/*<div  style={{ marginBottom: '20px',textAlign:"end" }}>*/}
            {/*<Button onClick={showModal} style={{marginRight:'10px'}}>*/}
            {/*  Create A New Post*/}
            {/*</Button>*/}
            {/*  <Button onClick={showMyFavour}>*/}
            {/*    My Bookmark*/}
            {/*  </Button>*/}
            {/*</div>*/}
            <Modal title="New Post" visible={open} onOk={handleAdd} confirmLoading={confirmLoading}
                   onCancel={handleCancel}>
                <Input type="text"
                       style={{marginBottom: '10px'}}
                       value={newPostTitle}
                       onChange={(e) => setNewPostTitle(e.target.value)}
                       placeholder="Title"/>
                <Input type="text"
                       style={{marginBottom: '10px'}}
                       value={newPostTags}
                       onChange={(e) => setNewPostTags(e.target.value)}
                       placeholder="Tags (use ',' to divide)"/>
                <TextArea
                    showCount
                    maxLength={8192}
                    style={{height: 120, resize: 'none', marginBottom: '10px'}}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Content.."
                />
            </Modal>


            <Row gutter={16}>
                {posts.map((post) => (
                    <Col span={12} key={post.id}>
                        <Card
                            title={
                                <Link to={`/post/content/${post.id}`}>
                                    {post.title}
                                </Link>
                            }
                            bordered={true}
                            style={{
                                marginBottom: '20px',
                                height: '150px',
                                overflow: 'hidden',
                            }}
                            extra={
                                <div>
                                    {post.tagList.map((tag) => (
                                        <Tooltip title="Filter By Tag">
                                        <Button onClick={() => filterByTag(tag)} style={{marginLeft: "3px"}}
                                                size="small">
                                            {tag}
                                        </Button>
                                        </Tooltip>
                                    ))}
                                </div>
                            }

                        >
                            <div
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {post.content}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Pagination
                current={currentPage} // 当前页数
                //居中
                style={{textAlign: 'center', marginTop: '20px'}}
                pageSize={pageSize} // 每页显示数量
                total={totalPosts} // 总帖子数
                onChange={handlePageChange} // 处理分页变化事件
            />
        </PageContainer>
    );
};

export default Resources;
