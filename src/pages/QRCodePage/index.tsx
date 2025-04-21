import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin } from "antd";
import QRCode from "react-qr-code";
import { Events, getEvents } from "../../api/Events";

const { Title } = Typography;

const QRCodePage: React.FC = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<Events | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const allEvents = await getEvents();
      const found = allEvents.find((e) => e.slug === slug);
      setEvent(found || null);
      setLoading(false);
    };

    fetchEvent();
  }, [slug]);

  if (loading) return <Spin style={{ display: "flex", justifyContent: "center", marginTop: 100 }} />;

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Title level={4}>Escaneie para enviar fotos para este evento:</Title>
      {event && <QRCode value={event.upload_url} size={256} />}
    </div>
  );
};

export default QRCodePage;