import React, { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useParams } from "react-router-dom";
import { Spin, message } from "antd";
import QRCode from "react-qr-code";

const SLIDE_INTERVAL = 5000;

interface Photo {
  id: string;
  image_url: string;
}

const GalleryPage: React.FC = () => {
  const { slug } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const fetchPhotos = async (event_id: string) => {
    const { data, error } = await supabase
      .from("photos")
      .select("id, image_url")
      .eq("event_id", event_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar fotos:", error);
    } else {
      setPhotos(data || []);
    }
  };

  useEffect(() => {
    const loadEventId = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("events")
        .select("id, upload_url")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        message.error("Evento não encontrado.");
        setLoading(false);
        return;
      }
      setEventId(data.id);
      setUploadUrl(data.upload_url);
      await fetchPhotos(data.id);
      setLoading(false);
    };

    loadEventId();
  }, [slug]);

  useEffect(() => {
    if (photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [photos]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin tip="Carregando galeria..." />
      </div>
    );
  }

  if (photos.length === 0 && uploadUrl) {
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 20,
          overflow: "block",
        }}
      >
        <QRCode value={uploadUrl} size={220} />
        <p style={{ marginTop: 24, fontSize: 40 }}>
          Nenhuma foto enviada ainda...
          <br />
          Escaneie o QR Code para compartilhar os melhores momentos da festa! 📸🎉
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={photos[currentIndex].image_url}
        alt="Slide"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      {uploadUrl && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#fff",
            padding: 8,
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <QRCode value={uploadUrl} size={80} />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
