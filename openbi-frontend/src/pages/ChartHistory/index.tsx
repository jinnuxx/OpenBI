import {request} from '@umijs/max';
import React, {useEffect, useRef, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {Button, Card, Col, Divider, Row, Modal, List, message} from "antd";
import {deleteChartUsingPOST, editChartUsingPOST} from "@/services/openbi/chartController";
import {EllipsisOutlined, FullscreenOutlined, EditOutlined} from "@ant-design/icons";
import {PageContainer} from '@ant-design/pro-components';

const ChartHistory = () => {
    const [chartDataList, setChartDataList] = useState([]); // 使用数组存储多个响应数据

    const [visible, setVisible] = useState(false); // State to control the modal visibility
    const [selectedChartData, setSelectedChartData] = useState(null); // Store the selected chart data

    const [fullScreenModalVisible, setFullScreenModalVisible] = useState(false);
    const [fullScreenModalHeight, setFullScreenModalHeight] = useState("60vh");

    const [inFullScreenMode, setInFullScreenMode] = useState(false);

    const chartRef = useRef(null); // Reference to the ECharts component

    const [initialChartOption, setInitialChartOption] = useState(null);

    const [currentEchartsId, setCurrentEchartsId] = useState(null);


    const [jsonEditorVisible, setJsonEditorVisible] = useState(false);
    const [editedJson, setEditedJson] = useState('');
    const [editedChartId, setEditedChartId] = useState(null);

    function getCookieValue(cookieName) {
        const name = cookieName + "=";
        // 注意：我们不再这里解码整个cookie字符串
        const cookieArray = document.cookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            // 检查这个cookie条目是否有我们要找的名称
            if (cookie.startsWith(name)) {
                const cookieValue = cookie.substring(name.length);
                // 尝试解码每个cookie的值
                try {
                    return decodeURIComponent(cookieValue);
                } catch (e) {
                    console.error(`Error decoding cookie '${cookieName}': ${e.message}`);
                    // 出错时可能返回原始的、未编码的值，或者空字符串，取决于您的需要
                    return cookieValue; // 或者 return "";
                }
            }
        }
        return "";
    }

    const userId = getCookieValue("userId");

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
        return date.toLocaleDateString(undefined, options);
    };

    const fetchData = async () => {
        try {
            const response = await request(`/api/chart/getChartsByUserId?id=${userId}`, {
                method: 'GET',
            });
            if (response.data != null) {
                const responseData = response.data;
                console.log("responseData: "+responseData);
                setChartDataList(responseData);
            } else {
                setChartDataList([
                    {id: '', name: '', goal: '', chartType: '', createTime: '', genChart: null}
                ]);
            }
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    // 在组件加载时保存初始 ECharts 实例的选项
    useEffect(() => {
        if (chartRef.current) {
            setInitialChartOption(chartRef.current.getEchartsInstance().getOption());
        }
    }, []);

    // Function to open the modal and set the selected chart data
    const openModal = (chartData) => {
        setSelectedChartData(chartData);
        setVisible(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setSelectedChartData(null);
        setVisible(false);
    };

    // Function to render the modal content
    const renderModalContent = () => {
        if (!selectedChartData) {
            return null;
        }

        return (
            <List size="large" bordered>
                {/*<h2>Analysis Result for {selectedChartData.name || "Not Specify"}:</h2>*/}
                {/* Render the analysis result content here based on selectedChartData */}
                <List.Item><List.Item.Meta title="Analysis Goal: "
                                           description={selectedChartData.goal}></List.Item.Meta></List.Item>
                <List.Item><List.Item.Meta title={"Chart Type: "}
                                           description={selectedChartData.chartType + " chart"}></List.Item.Meta></List.Item>
                <List.Item><List.Item.Meta title={"Create Time: "}
                                           description={formatDate(selectedChartData.createTime)}></List.Item.Meta></List.Item>
                <List.Item><List.Item.Meta title={"Analysis Result: "}
                                           description={selectedChartData.genResult}></List.Item.Meta></List.Item>

            </List>
        );
    };

    const openFullScreenModal = (chartData) => {

        // 如果currentEchartsId和当前的不同，则设置当前的currentEchartsId，并且销毁原始的实例
        if (currentEchartsId !== chartData.id) {
            setCurrentEchartsId(chartData.id);
            if (chartRef.current) {
                chartRef.current.getEchartsInstance().dispose();
            }
        }

        setSelectedChartData(chartData);
        setFullScreenModalVisible(true);
        setFullScreenModalHeight("60vh");
        // Set full-screen mode to true
        setInFullScreenMode(true);
    };


    const closeFullScreenModal = () => {
        setFullScreenModalVisible(false);
        setSelectedChartData(null);
        setFullScreenModalHeight("60vh");
        // Reset full-screen mode to false
        setInFullScreenMode(false);
    };

    const renderFullScreenModalContent = () => {
        if (!selectedChartData) {
            return null;
        }

        return (
            <div style={{width: "100%", height: fullScreenModalHeight}}>
                <ReactECharts
                    ref={chartRef}
                    option={JSON.parse(selectedChartData.genChart)}
                    style={{width: "100%", height: "100%"}}
                />
            </div>
        );
    };

    const openJsonEditorModal = (genChart, id) => {
        setEditedJson(genChart); // 将原始 JSON 数据填充到编辑器中
        setJsonEditorVisible(true);
        setEditedChartId(id);
        console.log("chartid" + id)
    };

    const closeJsonEditorModal = () => {
        setJsonEditorVisible(false);
        setEditedChartId(null);
    };

    const saveEditedJson = async () => {
        try {
            // 构建 ChartEditRequest 对象
            const editedData = {
                genChart: editedJson, // 更新为编辑后的 JSON 数据
                id: editedChartId, // 更新为当前图表的 ID
            };

            // 调用后端接口来保存编辑后的数据
            const response = await editChartUsingPOST(editedData);

            if (response?.data) {
                // 保存成功，可以在这里处理成功的逻辑
                message.success('Chart data saved successfully');
                // 从chartDataList中删除当前的chart
                const newChartDataList = chartDataList.filter((chartData) => chartData.id !== editedChartId);
                setChartDataList(newChartDataList);

                // 重新加载数据
                fetchData();

            } else {
                // 保存失败，显示错误消息
                message.error('Failed to save chart data. Please try again.');
            }
        } catch (error) {
            // 发生异常，显示错误消息
            console.error('Error saving chart data:', error);
            message.error('An error occurred while saving chart data. Please try again.');
        } finally {
            // 无论成功或失败，都要关闭编辑模态框
            setJsonEditorVisible(false);
        }
    };

    const deleteChart = async () => {
        try {
            // 构建 ChartEditRequest 对象
            const editedData = {
                id: editedChartId, // 更新为当前图表的 ID
            };

            // 调用后端接口来保存编辑后的数据
            const response = await deleteChartUsingPOST(editedData);

            if (response?.data) {
                // 保存成功，可以在这里处理成功的逻辑
                message.success('Chart delete successfully');

                // 清空datalist
                setChartDataList([]);

                fetchData();


            } else {
                // 保存失败，显示错误消息
                message.error('Failed to delete chart. Please try again.');
            }
        } catch (error) {
            // 发生异常，显示错误消息
            console.error('Error saving chart data:', error);
            message.error('An error occurred while deleting chart data. Please try again.');
        } finally {
            // 无论成功或失败，都要关闭编辑模态框
            setJsonEditorVisible(false);
        }
    }


    // 处理图表渲染
    const renderChart = (genChart, id) => {
        try {
            if (!genChart) {
                return <div>No chart data available.</div>;
            }

            const chartOption = JSON.parse(genChart);
            return <ReactECharts option={chartOption} style={{ width: '100%', height: '400px' }} />;
        } catch (e) {
            console.error('JSON Syntax Error:', e);
            console.log("id" + id);
            return (
                <>
                    <div style={{ color: 'red' }}>Failed to parse and render the chart. Please check the data format.</div>
                    {/* 点击按钮修改此处图表的JSON代码 */}
                    <Button onClick={() => openJsonEditorModal(genChart, id)}>Edit JSON</Button>
                </>
            );
        }
    }



    return (
        <PageContainer
            ghost
            header={{
                title: 'Chart History',
                breadcrumb: {},
                style: {textAlign: 'center'},
            }}>
            {/*<h2 style={{fontWeight: "bold", textAlign: "center"}}>Chart History</h2>*/}
            {/*<br/>*/}
            <Row gutter={16}>
                {chartDataList.map((chartData, index) => (

                    <Col span={12} key={index}>
                        <Card
                            title={chartData.name === (null || "") ? "Not Specify" : chartData.name}
                            extra={
                                <>
                                    <Button icon={<EllipsisOutlined/>} style={{marginRight: "5px"}}
                                            onClick={() => openModal(chartData)}></Button>
                                    <Button icon={<EditOutlined/>} style={{marginRight: "5px"}}
                                            onClick={() => openJsonEditorModal(chartData.genChart, chartData.id)}></Button>
                                    <Button icon={<FullscreenOutlined/>}
                                            onClick={() => openFullScreenModal(chartData)}></Button>
                                </>
                            }
                        >
                            <div style={{flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                <p style={{textAlign: 'center'}}>Analysis Goal: {chartData.goal}</p>
                                <p style={{textAlign: 'center'}}>Chart Type: {chartData.chartType + " chart"}</p>
                                <p style={{textAlign: 'center'}}>Create Time: {formatDate(chartData.createTime)}</p>
                            </div>
                            {chartData.genChart && (
                                <Card>
                                    {/*检测SyntaxError: Unexpected non-whitespace character after JSON at position 952 (line 45 column 2)*/}
                                    {/* 异常处理 */}
                                    {renderChart(chartData.genChart, chartData.id)}
                                </Card>
                            )}
                        </Card>
                        <Divider/>
                    </Col>
                ))}
            </Row>

            {/* Modal for showing analysis result */}
            <Modal
                title="Analysis Result"
                visible={visible}
                onOk={closeModal}
                onCancel={closeModal}
                footer={null} // Hide the OK button
            >
                {renderModalContent()}
            </Modal>

            <Modal
                title="ECharts Full Screen View"
                visible={fullScreenModalVisible}
                onOk={closeFullScreenModal}
                onCancel={closeFullScreenModal}
                footer={null} // Hide the OK button
                width="100%"
                bodyStyle={{padding: 0}}
                maskStyle={{background: "rgba(0, 0, 0, 0.8)"}} // Add a dark overlay
                // zIndex={1001}
            >
                {renderFullScreenModalContent()}
            </Modal>

            {/* Modal for editing JSON */}
            <Modal
                title="Edit JSON"
                visible={jsonEditorVisible}
                onCancel={closeJsonEditorModal}
                footer={[
                    <Button key="delete" onClick={deleteChart}>
                        delete
                    </Button>,
                    <Button key="cancel" onClick={closeJsonEditorModal}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={saveEditedJson}>
                        Save
                    </Button>,
                ]}
            >
                <textarea
                    rows={10}
                    cols={50}
                    value={editedJson}
                    onChange={(e) => setEditedJson(e.target.value)}
                />
            </Modal>

        </PageContainer>
    );
};

export default ChartHistory;
