import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { App, Button, Card, Empty, Form, Input, Modal, Space, Spin, Tree } from 'antd';
import React, { useState } from 'react';
import {
  addTag,
  deleteTag,
  getPersonalAddressBook,
} from '@/services/rustdesk-console/addressBook';

const PersonalAddressBook: React.FC = () => {
  const intl = useIntl();
  const { message: msgApi } = App.useApp();
  const [addTagModalVisible, setAddTagModalVisible] = useState(false);
  const [addTagForm] = Form.useForm();

  const { data: abData, loading: abLoading, refresh: abRefresh } = useRequest(
    getPersonalAddressBook,
  );

  const handleAddTag = async (values: API.AddTagParams) => {
    try {
      await addTag('personal', values);
      msgApi.success(
        intl.formatMessage({ id: 'pages.addressBook.tagAdded', defaultMessage: 'Tag added' }),
      );
      setAddTagModalVisible(false);
      addTagForm.resetFields();
      abRefresh();
    } catch {
      msgApi.error(
        intl.formatMessage({
          id: 'pages.addressBook.tagAddFailed',
          defaultMessage: 'Failed to add tag',
        }),
      );
    }
  };

  const treeData = abData
    ? [
        {
          title: (
            <span>
              <FormattedMessage id="pages.addressBook.personal" defaultMessage="Personal Address Book" />
            </span>
          ),
          key: 'root',
          children: [],
        },
      ]
    : [];

  return (
    <PageContainer>
      <Card
        title={
          <FormattedMessage id="pages.addressBook.personal" defaultMessage="Personal Address Book" />
        }
        extra={
          <Space>
            <Button type="primary" onClick={() => setAddTagModalVisible(true)}>
              <FormattedMessage id="pages.addressBook.addTag" defaultMessage="Add Tag" />
            </Button>
          </Space>
        }
      >
        <Spin spinning={abLoading}>
          {abData ? (
            <Tree defaultExpandAll treeData={treeData} />
          ) : (
            <Empty
              description={
                <FormattedMessage
                  id="pages.addressBook.personal.empty"
                  defaultMessage="No personal address book data"
                />
              }
            />
          )}
        </Spin>
      </Card>

      <Modal
        title={<FormattedMessage id="pages.addressBook.addTag" defaultMessage="Add Tag" />}
        open={addTagModalVisible}
        onCancel={() => setAddTagModalVisible(false)}
        onOk={() => addTagForm.submit()}
      >
        <Form form={addTagForm} onFinish={handleAddTag}>
          <Form.Item
            name="name"
            label={<FormattedMessage id="pages.addressBook.tagName" defaultMessage="Tag Name" />}
            rules={[{ required: true, message: 'Please enter tag name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="color"
            label={<FormattedMessage id="pages.addressBook.tagColor" defaultMessage="Color" />}
          >
            <Input placeholder="#1890ff" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PersonalAddressBook;
