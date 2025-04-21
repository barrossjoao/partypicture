import React, { useEffect, useState } from "react";
import { Upload, Button, message, Typography, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../api/supabaseClient";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from("events")
        .select("id")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        message.error("Evento não encontrado.");
        setLoadingEvent(false);
        return;
      }

      setEventId(data.id);
      setLoadingEvent(false);
    };

    fetchEvent();
  }, [slug]);

  const handleUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    if (!eventId) return;

    setUploading(true);
    const typedFile = file as File;
    const fileName = `${uuidv4()}-${typedFile.name}`;

    const {  error } = await supabase.storage
      .from("event-photos")
      .upload(fileName, file);

    if (error) {
      message.error("Erro ao fazer upload");
      onError?.(error);
      setUploading(false);
      return;
    }

    const publicUrl = supabase.storage
      .from("event-photos")
      .getPublicUrl(fileName).data.publicUrl;

    const { error: insertError } = await supabase.from("photos").insert({
      event_id: eventId,
      image_url: publicUrl,
    });

    if (insertError) {
      message.error("Erro ao salvar imagem no banco");
      onError?.(insertError);
      setUploading(false);
      return;
    }

    message.success("Imagem enviada com sucesso!");
    onSuccess?.({});
    setUploading(false);
  };

  if (loadingEvent) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin tip="Carregando evento..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <Title level={3}>Envie sua foto da festa 🎉</Title>
      <Upload
        customRequest={handleUpload}
        showUploadList={false}
        accept="image/*"
        capture="environment"
      >
        <Button
          icon={<UploadOutlined />}
          loading={uploading}
          disabled={uploading}
          type="primary"
        >
          Enviar Foto
        </Button>
      </Upload>
    </div>
  );
};

export default UploadPage;