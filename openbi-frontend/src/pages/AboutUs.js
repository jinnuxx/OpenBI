import React from 'react';
import {Row, Col, Typography, Image, Card, Divider, Avatar, List} from 'antd';
import '../global.less';
import {PageContainer} from "@ant-design/pro-components";

const {Text, Title, Paragraph} = Typography;

const data = [
    {
        title: 'Zhaohao Lu',
        description: 'zhlu7335@gmail.com',
    },
];

export default function AboutUs() {
    return (
        <PageContainer
            ghost
            header={{
                title: 'About Me',
                breadcrumb: {},
                style: { textAlign: 'center' },
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                                    }
                                    title={item.title}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <div style={{ textAlign: 'center' }}>
                        <Image
                            style={{ borderRadius: "10px", maxWidth: '100%', height: 'auto' }}
                            preview={false}
                            src="/aboutUs.png"
                            alt="About Us"
                        />
                    </div>
                </Col>
            </Row>
        </PageContainer>

    );
}
