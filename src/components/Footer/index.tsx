import { GithubOutlined, SyncOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { DefaultFooter } from '@ant-design/pro-components';
import { Badge, Button } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { checkUpdate } from '@/services/rustdesk-console/system';
import UpdateCheckModal from '@/components/UpdateCheckModal';

const Footer: React.FC = () => {
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState(false);
  const [cachedResult, setCachedResult] = useState<API.UpdateCheckResult | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const autoChecked = useRef(false);

  const doAutoCheck = useCallback(async () => {
    try {
      const res = await checkUpdate({ frontend_version: FRONTEND_VERSION });
      setCachedResult(res);
      if (res?.backend?.has_update || res?.frontend?.has_update) {
        setHasUpdate(true);
      }
    } catch {
      // silent fail for auto check
    }
  }, []);

  useEffect(() => {
    if (!autoChecked.current) {
      autoChecked.current = true;
      doAutoCheck();
    }
  }, [doAutoCheck]);

  return (
    <>
      <DefaultFooter
        style={{
          background: 'none',
        }}
        copyright="2026 Data Block"
        links={[
          {
            key: 'check-update',
            title: (
              <Badge dot={hasUpdate} offset={[6, 0]}>
                <Button
                  type="text"
                  size="small"
                  icon={<SyncOutlined />}
                  style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(true);
                  }}
                >
                  {intl.formatMessage({ id: 'app.updateCheck.button' })}
                </Button>
              </Badge>
            ),
            href: '#',
          },
          {
            key: 'github',
            title: <GithubOutlined />,
            href: 'https://github.com/databk/rustdesk-console',
            blankTarget: true,
          },
        ]}
      />
      <UpdateCheckModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cachedResult={cachedResult}
      />
    </>
  );
};

export default Footer;
