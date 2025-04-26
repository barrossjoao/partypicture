import React, { useEffect, useState } from "react";
import { Upload, Button, Typography, Spin, notification } from "antd";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdCamera } from "react-icons/io";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import imageCompression from "browser-image-compression";
import styles from "./styles.module.css";
import { BsMoon, BsSun } from "react-icons/bs";
import html2canvas from "html2canvas";
import { getEventBySlug } from "../../api/Events";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";
const { Title } = Typography;

const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState<string | null>(null);
  const { slug } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const fetchEvent = async () => {
    if (!slug) return;

    const data = await getEventBySlug(slug);

    if (!data) {
      navigate("/404");
      return;
    }

    setEventId(data.id);
    setEventName(data.name);
    setEventDate(data.event_date ?? null);
    setLoadingEvent(false);
  };

  const downloadPolaroidImage = async () => {
    const polaroidElement = document.getElementById("polaroid-preview");
    if (!polaroidElement) return;

    const canvas = await html2canvas(polaroidElement, {
      useCORS: true,
      backgroundColor: "#e9e9e9",
    });

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "polaroid.png";
    link.click();
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const sharePolaroidImageFile = async () => {
    const polaroidElement = document.getElementById("polaroid-preview");
    if (!polaroidElement) return;

    try {
      const canvas = await html2canvas(polaroidElement, {
        useCORS: true,
        backgroundColor: "#e9e9e9",
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );

      if (!blob) {
        throw new Error("Erro ao gerar imagem para compartilhamento");
      }

      const file = new File([blob], "polaroid.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Minha Polaroid",
          text: "Confira minha foto da festa! 🎉",
        });
      } else {
        alert("Compartilhamento de arquivos não suportado neste navegador.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao compartilhar polaroid. Tente novamente.");
    }
  };

  const openInstagram = () => {
    window.location.href = "instagram://camera";

    setTimeout(() => {
      alert(
        "Se o app Instagram não abriu, verifique se está instalado no seu celular."
      );
    }, 3000);
  };

  const handleImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/jpeg",
    };
    return await imageCompression(file, options);
  };

  const handleBeforeUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);

    return false;
  };

  const confirmUpload = async () => {
    if (!selectedFile || !eventId) return;

    setUploading(true);

    try {
      const compressedFile = await handleImage(selectedFile);
      const fileName = `${uuidv4()}-${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("event-photos")
        .upload(fileName, compressedFile);

      if (uploadError) {
        throw uploadError;
      }

      const publicUrl = supabase.storage
        .from("event-photos")
        .getPublicUrl(fileName).data.publicUrl;

      const { error: insertError } = await supabase.from("photos").insert({
        event_id: eventId,
        image_url: publicUrl,
      });

      if (insertError) {
        throw insertError;
      }

      api.success({
        message: "Upload concluído",
        description: "Sua imagem foi enviada com sucesso!",
      });

      setSelectedFile(null);
      setSelectedImage(null);
    } catch {
      api.error({
        message: "Erro ao enviar imagem",
        description: "Tente novamente.",
      });
    } finally {
      setUploading(false);
    }
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

          {selectedImage && (
            <>
              <div id="polaroid-preview" className={styles.polaroidWrapper}>
                <img
                  src={selectedImage}
                  alt="Preview"
                  className={styles.polaroidImage}
                />
                <span className={styles.polaroidText}>
                  {eventName} <br />
                  {eventDate
                    ? new Date(eventDate).toLocaleDateString("pt-BR")
                    : ""}
                </span>
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Button
                  type="primary"
                  onClick={confirmUpload}
                  loading={uploading}
                  style={{ marginBottom: 8 }}
                >
                  Confirmar Envio
                </Button>
                <Button type="default" onClick={downloadPolaroidImage}>
                  Baixar Polaroid
                </Button>
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      type="default"
                      shape="circle"
                      size="large"
                      onClick={sharePolaroidImageFile}
                      style={{
                        backgroundColor: "#25D366", 
                        border: "none",
                      }}
                    >
                      <FaWhatsapp
                        style={{ color: "#fff", fontSize: 24 }}
                      />
                    </Button>

                    <Button
                      type="default"
                      shape="circle"
                      size="large"
                      onClick={sharePolaroidImageFile}
                      style={{
                        backgroundColor: "#1877F2", 
                        border: "none",
                      }}
                    >
                      <FaFacebook
                        style={{ color: "#fff", fontSize: 24 }}
                      />
                    </Button>

                    <Button
                      type="default"
                      shape="circle"
                      size="large"
                      onClick={openInstagram}
                      style={{
                        backgroundColor: "#E1306C",
                        border: "none",
                      }}
                    >
                      <FaInstagram style={{ color: "#fff", fontSize: 24 }} />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {!selectedImage && (
            <div className={styles.buttonGroup}>
              <Upload
                beforeUpload={handleBeforeUpload}
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
                beforeUpload={handleBeforeUpload}
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
          )}
        </div>
      </div>
    </>
  );
};

export default UploadPage;
