import React, { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useParams } from "react-router-dom";
import { Spin, message } from "antd";

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
  const [loading, setLoading] = useState(true);

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
        .select("id")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        message.error("Evento não encontrado.");
        setLoading(false);
        return;
      }

      setEventId(data.id);
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
      <div style={{ height: "100vh", backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin tip="Carregando galeria..." />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        Nenhuma foto enviada ainda...
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
    </div>
  );
};

export default GalleryPage;