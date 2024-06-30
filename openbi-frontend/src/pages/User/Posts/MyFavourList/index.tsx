import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { request } from '@umijs/max';
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
import { Pagination,Button, Modal, Input, Row, Col, Card, Tag } from 'antd';
import { Link, useLocation } from 'react-router-dom';

// Import SearchPost component
import {listMyFavourPostByPageUsingPOST} from "@/services/openbi/postFavourController";
import { PageContainer } from '@ant-design/pro-components';

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
const { TextArea } = Input;

const MyFavourList = () => {
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

    });

    const handleFilterChange = (filterType: any, value: any) => {
        setFilterOptions({ ...filterOptions, [filterType]: value });
    };

    const handlePageChange = (page, pageSize) => {
        // 处理分页变化事件
        setCurrentPage(page);
        setPageSize(pageSize);
    };


    useEffect(() => {
        const fetchData = async () => {
            const response = await listMyFavourPostByPageUsingPOST({ current: currentPage, pageSize: pageSize });
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
        };

        fetchData();
    }, [userId, currentPage, pageSize]); // 添加 currentPage 和 pageSize 作为依赖

    const showModal = () => {
        setOpen(true);
    };


    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const handleAdd = async () => {
        try {
            const tagsArray = newPostTags.split(',');
            const response = await addPostUsingPOST({ title: newPostTitle, tags: tagsArray, content: newPostContent });
            console.log('Post added successfully');

            // 刷新帖子列表
            const refreshResponse = await listMyPostVOByPageUsingPOST({ current: currentPage, pageSize: pageSize });
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

    const handleSearchMy = async () => {
        try {
            const response = await listMyFavourPostByPageUsingPOST({
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



    // const handleEdit = async (id: number, title: string, tag: string, content: string) => {
    //   try {
    //     const tagsArray = newPostTags.split(','); // 将逗号分隔的标签字符串转换为字符串数组
    //     const response = await editPostUsingPOST({ id, title: newPostTitle, tags: tagsArray, content: newPostContent });
    //     console.log('Post edited successfully');
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };



    const showMyFavour = async () => {
        const response = await listMyFavourPostByPageUsingPOST({
            current: currentPage,
            pageSize: pageSize,
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

    }

    return (
        <PageContainer
            ghost
            header={{
                title: 'My Favours',
                breadcrumb: {},
                style: { textAlign: 'center' },
            }}
        >

            {/*<h2></h2>*/}

            {/*<br/>*/}

            <Input.Search
                placeholder="Search my favours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearchMy}
                style={{ marginBottom: '20px' }}
            />

            {/*<div  style={{ marginBottom: '20px',textAlign:"end" }}>*/}
            {/*    <Button onClick={showModal} style={{marginRight:'10px'}}>*/}
            {/*        Create A New Post*/}
            {/*    </Button>*/}
            {/*    <Button onClick={showMyFavour}>*/}
            {/*        View My Bookmark*/}
            {/*    </Button>*/}
            {/*</div>*/}
            <Modal title="New Post" visible={open} onOk={handleAdd} confirmLoading={confirmLoading} onCancel={handleCancel} >
                <Input type="text"
                       style={{ marginBottom: '10px' }}
                       value={newPostTitle}
                       onChange={(e) => setNewPostTitle(e.target.value)}
                       placeholder="Title" />
                <Input type="text"
                       style={{ marginBottom: '10px' }}
                       value={newPostTags}
                       onChange={(e) => setNewPostTags(e.target.value)}
                       placeholder="Tags (use ',' to divide)" />
                <TextArea
                    showCount
                    maxLength={8192}
                    style={{ height: 120, resize: 'none', marginBottom: '10px' }}
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
                                <Link to={`/post/myFavours/${post.id}`}>
                                    {post.title}
                                </Link>
                            }
                            bordered={false}
                            style={{
                                marginBottom: '20px',
                                height: '150px',
                                overflow: 'hidden',
                            }}
                            extra={
                                // tags
                                <div>
                                    {post.tagList.map((tag) => (
                                        <Tag color="default"
                                             key={tag}
                                             style={{ marginLeft: '0px' }}
                                        >
                                            {tag}
                                        </Tag>
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
                style={{ textAlign: 'center', marginTop: '20px' }}
                pageSize={pageSize} // 每页显示数量
                total={totalPosts} // 总帖子数
                onChange={handlePageChange} // 处理分页变化事件
            />
        </PageContainer>
    );
};

export default MyFavourList;
