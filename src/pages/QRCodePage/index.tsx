import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin } from "antd";
import QRCode from "react-qr-code";
import { Events, getEventBy } from "../../api/Events";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
} from "react-share";
import { Button, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const { Title } = Typography;

const QRCodePage: React.FC = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<Events | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      const found = await getEventBy('slug', slug);
      setEvent(found || null);
      setLoading(false);
    };

    fetchEvent();
  }, [slug]);

  if (loading)
    return (
      <Spin
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      />
    );

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {event && (
        <div
          style={{
            padding: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            maxHeight: "400px",
            height: "400px",
            border: "1px solid rgba(204, 204, 204, 0.5)",
            borderRadius: "8px",
            boxShadow: "-2px 0px -4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title level={4}>
            Escaneie para enviar fotos para o Evento - {event.name}
          </Title>

          <QRCode
            value={event.upload_url}
            size={256}
            style={{ marginBottom: "24px" }}
          />

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "19px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FacebookShareButton url={event.upload_url}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <WhatsappShareButton url={event.upload_url}>
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>
            <TwitterShareButton url={event.upload_url}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            <Tooltip title="Copiar link">
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(event.upload_url);
                }}
              />
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodePage;
