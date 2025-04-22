import React, { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useParams } from "react-router-dom";
import { Button, Spin, message } from "antd";
import QRCode from "react-qr-code";
import { MdFullscreen } from "react-icons/md";
import { getTimeConfigEventByEventId } from "../../api/EventsConfig";
import { getPhotosByEventId } from "../../api/Photos";
import { getEventBySlug } from "../../api/Events";

interface Photo {
  id: string;
  image_url: string;
}

const GalleryPage: React.FC = () => {
  const { slug } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeConfig, setTimeConfig] = useState<number | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [showFullscreenBtn, setShowFullscreenBtn] = useState<boolean>(false);

  const fetchPhotos = async (event_id: string) => {
    await getPhotosByEventId(event_id)
      .then((data) => {
        if (data.length > 0) {
          setPhotos(data);
        } else {
          message.error("Nenhuma foto encontrada para este evento.");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar fotos:", error);
        message.error("Erro ao buscar fotos.");
      });
  };

  const fetchTimeConfig = async (event_id: string) => {
    try {
      const time = await getTimeConfigEventByEventId(event_id);
      if (time) {
        const seconds = parseInt(time, 10);
        setTimeConfig(isNaN(seconds) ? null : seconds);
      }
    } catch (error) {
      console.error("Erro ao buscar configuração de tempo:", error);
    }
  };

  const subscribeToNewPhotos = (eventId: string) => {
    const channel = supabase
      .channel(`photos-insert-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photos",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const newPhoto = payload.new as Photo;
          setPhotos((prev) => [...prev, newPhoto]);
          console.log("📸 Nova foto recebida via realtime:", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const loadEventData = async () => {
      if (!slug) return;

      const eventData = await getEventBySlug(slug);
      if (!eventData) {
        message.error("Evento não encontrado.");
        setLoading(false);
        return;
      }
      
      setUploadUrl(eventData.upload_url);
      await fetchPhotos(eventData.id);
      await fetchTimeConfig(eventData.id);
      setLoading(false);
      
      unsubscribe = subscribeToNewPhotos(eventData.id);
    };

    loadEventData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [slug]);

  useEffect(() => {
    if (photos.length === 0 || !timeConfig) return;

    const initial = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 1000);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, timeConfig * 1000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [photos, timeConfig]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const toggleFullScreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

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
          height: "100%",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 20,
        }}
      >
        <div
          onMouseEnter={() => setShowFullscreenBtn(true)}
          onMouseLeave={() => setShowFullscreenBtn(false)}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: 100,
            height: 80,
            zIndex: 9,
          }}
        >
          {showFullscreenBtn && (
            <Button
              onClick={toggleFullScreen}
              style={{
                position: "fixed",
                top: 20,
                right: 20,
                background: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                zIndex: 10,
              }}
              icon={<MdFullscreen />}
            >
              Tela cheia
            </Button>
          )}
        </div>
        <QRCode value={uploadUrl} size={300} />
        <p style={{ marginTop: 24, fontSize: 40 }}>
          Nenhuma foto enviada ainda...
          <br />
          Escaneie o QR Code para compartilhar os melhores momentos da festa!
          📸🎉
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
      <div
        onMouseEnter={() => setShowFullscreenBtn(true)}
        onMouseLeave={() => setShowFullscreenBtn(false)}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 100,
          height: 80,
          zIndex: 9,
        }}
      >
        {showFullscreenBtn && (
          <Button
            onClick={toggleFullScreen}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              background: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              zIndex: 10,
            }}
            icon={<MdFullscreen />}
          >
            Tela cheia
          </Button>
        )}
      </div>
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
