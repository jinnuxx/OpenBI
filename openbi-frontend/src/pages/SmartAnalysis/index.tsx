import {genChartByAiUsingPOST} from '@/services/openbi/chartController';
import {QuestionCircleOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import {Alert, Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Tour, TourProps, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, {useEffect, useRef, useState} from 'react';
import Marquee from 'react-fast-marquee';
import {PageContainer} from "@ant-design/pro-components";
import type { UploadProps } from 'antd';




/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
    const [chart, setChart] = useState<API.BiResponse>();
    const [option, setOption] = useState<any>();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const { Dragger } = Upload;


    const [guess, setGuess] = useState(0); // 用户的猜测
    const [targetNumber, setTargetNumber] = useState(generateRandomNumber()); // 目标数字
    const [attempts, setAttempts] = useState(0); // 猜测尝试次数
    const [isGameWon, setIsGameWon] = useState(false); // 游戏是否已赢
    const [hint, setHint] = useState(null); // 初始状态设置为null
    const [minRange, setMinRange] = useState(1); // 最小允许猜测范围
    const [maxRange, setMaxRange] = useState(100); // 最大允许猜测范围

    // 生成一个 1 到 100 之间的随机数作为目标数字
    function generateRandomNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }

    // 处理用户的猜测
    function handleGuess(event) {
        const userGuess = parseInt(event.target.value, 10);
        setGuess(userGuess);

        // 用户进行第一次猜测时，设置提示
        if (hint === null) {
            setHint('You can guess the number between 1 and 100');
        }
    }

    // 处理用户提交猜测
    function handleGuessSubmit(event) {
        event.preventDefault();
        setAttempts(attempts + 1);

        if (guess === targetNumber) {
            setIsGameWon(true);
            setHint(`Congratulations! You guessed the number in ${attempts} attempts.`);
        } else {
            if (guess < targetNumber) {
                setMinRange(guess + 1);
                setHint(`The answer is between ${guess + 1} and ${maxRange}. Try again!`);
            } else {
                setMaxRange(guess - 1);
                setHint(`The answer is between ${minRange} and ${guess - 1}. Try again!`);
            }
        }
    }

    // 重新开始游戏
    function restartGame() {
        setTargetNumber(generateRandomNumber());
        setGuess(0);
        setAttempts(0);
        setHint(null); // 游戏重新开始时，将提示设置为null
        setMinRange(1);
        setMaxRange(100);
        setIsGameWon(false);
    }


    const echartsReactRef = useRef(null);

    const handleExportChart = () => {
        // 使用ref来获取ECharts实例的引用
        // @ts-ignore
        const echartsInstance = echartsReactRef.current.getEchartsInstance();
        if (echartsInstance) {
            // 调用getDataURL方法来获取图表的DataURL
            const dataURL = echartsInstance.getDataURL();
            // 创建一个隐藏的<a>标签
            const a = document.createElement('a');
            a.href = dataURL;
            // 设置下载文件的名称
            a.download = 'chart.png';
            // 模拟用户点击链接以触发下载
            a.click();
        }
    };

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    /**
     * 提交
     * @param values
     */
    const onFinish = async (values: any) => {

        // setOption(JSON.parse(test));

        // 避免重复提交
        if (submitting) {
            return;
        }
        setSubmitting(true);
        setChart(undefined);
        setOption(undefined);
        // 对接后端，上传数据
        const params = {
            ...values,
            file: undefined,
        };
        try {
            const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
            if (!res?.data) {
                message.error('Something went wrong');
            } else {
                message.success('Analyse success');
                try {
                    const chartOption = JSON.parse(res.data.genChart ?? '');

                    if (!chartOption) {
                        throw new Error('Chart code parsing error')
                    } else {
                        setChart(res.data);
                        setOption(chartOption);

                    }
                }
                catch (e) {
                    message.error('Chart code parsing error');
                    console.log(e);
                    //弹出提示框告诉用户到Chart History里修改
                    message.info('Chart code parsing error, you can go to Chart History to modify the Chart JSON code');
                }
            }
        } catch (e: any) {
            message.error('Failure to analyse, ' + e.message);
        }
        setSubmitting(false);
    };

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);

    const [open, setOpen] = useState<boolean>(false);

    const steps: TourProps['steps'] = [
      {
        title: 'Describe goal',
        description: 'Describe your analysis goal for your uploaded data',
        target: () => ref1.current,
      },
      {
        title: 'Optional name',
        description: 'Enter you chart name.',
        target: () => ref2.current,
      },
      {
        title: 'Optional type',
        description: 'Enter you chart type.',
        target: () => ref3.current,
      },
      {
        title: 'Upload File',
        description: 'Put your files here.',
        cover: (
            <img
              alt="tour.png"
              src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            />
          ),
        target: () => ref4.current,
      },
    ];
    return (
        <PageContainer
            ghost
            header={{
                title: 'Smart Analysis',
                breadcrumb: {},
                style: {textAlign: 'center'},
            }}>
        {/*<h2 style={{fontWeight: "bold", textAlign: "center"}}>Smart Analysis</h2>*/}
        {/*    <br/>*/}

            <div className="add-chart">
                <Row gutter={24}>

                    <Col span={24}>
                        {submitting && (
                            <Alert
                                type="info"
                                showIcon
                                message={
                                    <Marquee pauseOnHover gradient={false}>
                                        Please wait a moment. Your request is being processed.
                                    </Marquee>
                                }
                                style={{marginBottom: 24}}
                            />
                        )}
                        <Spin spinning={submitting}>

                        <Card
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Create an Analysis</span>
                                <Button type="text" onClick={() => setOpen(true)}>
                                    <QuestionCircleOutlined />
                                </Button>
                                </div>
                            }
                        >
                            <Form name="addChart" labelAlign="left" labelCol={{span: 4}} wrapperCol={{span: 20}}
                                  onFinish={onFinish} initialValues={{}}>
                                <div ref={ref1}>
                                <Form.Item
                                    name="goal"
                                    label="Analysis Goal"
                                    rules={[{required: true, message: 'Please enter the objective of the analysis'}]}
                                >
                                    <Input
                                        placeholder="Enter your analytics requirements, e.g. analyze user site growth"/>
                                </Form.Item></div>
                                <div ref={ref2}>
                                <Form.Item name="name" label="Chart Name">
                                    <Input placeholder="Enter a chart name"/>
                                </Form.Item></div>
                                <div ref={ref3}>
                                <Form.Item name="chartType" label="Chart type">
                                    <Select
                                        options={[
                                            {value: 'line', label: 'Line Chart'},
                                            {value: 'bar', label: 'Bar Chart'},
                                            {value: 'stack', label: 'Stacked Chart'},
                                            {value: 'pie', label: 'Pie Chart'},
                                            {value: 'radar', label: 'Radar Chart'},
                                        ]}
                                    />
                                </Form.Item></div>
                                <div ref={ref4}>
                                <Form.Item name="file" label="Raw Data">
                                    {/*<Upload name="file" maxCount={1}>*/}
                                    {/*    <Button icon={<UploadOutlined/>}>Upload CSV or Excel file</Button>*/}
                                    {/*</Upload>*/}
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">
                                            Support for a single upload. Only support CSV or Excel file.
                                        </p>
                                    </Dragger>
                                </Form.Item></div>
                                <Form.Item wrapperCol={{ span: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ flex: 1, marginRight: '4px' }}></div>
                                        <div style={{ flex: 1, marginRight: '8px' }}>
                                            <Button htmlType="reset" style={{ width: '100%' }}>
                                                Reset
                                            </Button>
                                        </div>
                                        <div style={{ flex: 4, marginLeft: '8px' }}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={submitting}
                                                disabled={submitting}
                                                style={{ width: '100%' }}
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </Form.Item>

                            </Form>
                            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
                        </Card>
                        </Spin>
                    </Col>
                    {submitting ? (

                        <Col span={24}>

                            <Divider/>

                            <Card title="Analysis in Progress…… Play a Game!">
                                <h2>Guess the Number</h2>
                                {isGameWon ? (
                                    <div>
                                        <Alert message={hint} type="success" showIcon
                                               action={<Button type="primary" onClick={restartGame}>Restart</Button>}/>
                                        {/*<Button type="primary" onClick={restartGame}>*/}
                                        {/*    Restart*/}
                                        {/*</Button>*/}
                                    </div>
                                ) : (
                                    <div>

                                        <p>Can you guess the number between {minRange} and {maxRange}?</p>
                                        <form onSubmit={handleGuessSubmit}>
                                            <Row gutter={16} align="middle">
                                                <Col span={12}>
                                                    <Input
                                                        style={{width: '100%'}}
                                                        type="number"
                                                        value={guess}
                                                        onChange={handleGuess}
                                                        min={minRange}
                                                        max={maxRange}
                                                        required
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        style={{width: '100%'}}
                                                    >
                                                        Submit Guess
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </form>
                                        <br/>
                                        {hint !== null && hint !== 0 && ( // 只有在提示不为null时显示Alert
                                            <Alert message={hint} type="info" showIcon
                                                   action={<Button onClick={restartGame}>Restart</Button>}/>
                                        )}
                                    </div>
                                )}
                            </Card>

                        </Col>
                    ) : chart ? (
                        <Col span={24}>
                            <Divider/>

                            <Card title="Analysis Conclusions">
                                {chart.genResult ?? <div>Please submit on the left first</div>}
                                <Spin spinning={submitting}/>
                            </Card>
                            <Divider/>
                            <Card title="Chart Visualization">
                                {option ? <ReactECharts ref={echartsReactRef} option={option}/> :
                                    <div>Please submit on the left first</div>}
                                <Spin spinning={submitting}/>
                                <Button onClick={handleExportChart} style={{width: '100%'}}>
                                    Export Chart
                                </Button>
                            </Card>

                        </Col>
                    ) : null}
                </Row>
            </div>
        </PageContainer>

    );
};
export default AddChart;
