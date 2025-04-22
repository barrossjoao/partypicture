import React, { useEffect, useState } from "react";
import { Upload, Button, message, Typography, Spin, notification } from "antd";
import type { UploadProps } from "antd";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../api/supabaseClient";
import { useParams } from "react-router-dom";
import { IoMdCamera } from "react-icons/io";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import imageCompression from "browser-image-compression";
import styles from "./styles.module.css";
import { BsMoon, BsSun } from "react-icons/bs";
const { Title } = Typography;

const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventName, setEventName] = useState<string | null>(null);
  const { slug } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const fetchEvent = async () => {
    if (!slug) return;
    const { data, error } = await supabase
      .from("events")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      message.error("Evento não encontrado.");
      setLoadingEvent(false);
      return;
    }

    setEventId(data.id);
    setEventName(data.name);
    setLoadingEvent(false);
  };

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const handleImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/jpeg",
    };
    return await imageCompression(file, options);
  };

  const handleUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    if (!eventId) return;

    setUploading(true);
    const typedFile = file as File;
    const fileName = `${uuidv4()}-${typedFile.name}`;

    const compressedFile = await handleImage(typedFile);

    const { error } = await supabase.storage
      .from("event-photos")
      .upload(fileName, compressedFile);

    if (error) {
      api.error({
        message: "Erro ao fazer upload",
        description: "Tente novamente em instantes.",
      });
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
      api.error({
        message: "Erro ao salvar a imagem",
        description: "Tente novamente em instantes.",
      });
      onError?.(insertError);
      setUploading(false);
      return;
    }

    api.success({
      message: "Upload concluído",
      description: "Sua imagem foi enviada com sucesso!",
    });
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
    <>
      {contextHolder}
      <div className={`${styles.pageContainer} ${darkMode ? styles.dark : ""}`}>
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 999,
          }}
        >
          <Button
            shape="circle"
            onClick={() => setDarkMode((prev) => !prev)}
            icon={darkMode ? <BsSun /> : <BsMoon />}
          />
        </div>
        <div className={styles.card}>
          <Title level={3} className={styles.title}>
            Envie sua foto da festa 🎉
            <br />
            <span className={styles.subtitle}>{eventName}</span>
          </Title>

          <div className={styles.buttonGroup}>
            <Upload
              customRequest={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button
                icon={<MdOutlineDriveFolderUpload />}
                loading={uploading}
                disabled={uploading}
                type="primary"
                size="large"
              >
                Enviar Imagem da Galeria
              </Button>
            </Upload>

            <Upload
              customRequest={handleUpload}
              showUploadList={false}
              accept="image/*"
              capture="environment"
            >
              <Button
                icon={<IoMdCamera />}
                loading={uploading}
                disabled={uploading}
                type="default"
                size="large"
              >
                Tirar Foto com a Câmera
              </Button>
            </Upload>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
