import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

const Workplace: React.FC = () => {
  const intl = useIntl();

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({
                id: 'pages.dashboard.totalDevices',
                defaultMessage: 'Total Devices',
              })}
              value={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({
                id: 'pages.dashboard.onlineDevices',
                defaultMessage: 'Online Devices',
              })}
              value={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({
                id: 'pages.dashboard.totalUsers',
                defaultMessage: 'Total Users',
              })}
              value={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({
                id: 'pages.dashboard.addressBooks',
                defaultMessage: 'Address Books',
              })}
              value={0}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Workplace;
