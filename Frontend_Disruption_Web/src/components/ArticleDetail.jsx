import React, { useEffect, useRef } from "react";
import { Button, Modal } from 'react-bootstrap';

const ArticleDetail = ({ article, onClose }) => {
  const mapRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    };

    const initMap = async () => {
      await loadGoogleMaps();

      if (article.lat && article.lng) {
        const lat = parseFloat(article.lat);
        const lng = parseFloat(article.lng);

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 12,
          mapId: "a455c7ca22d2b8d",
        });

        const severityIcons = {
          High: { url: "https://maps.google.com/mapfiles/ms/icons/red.png" },
          Medium: { url: "https://maps.google.com/mapfiles/ms/icons/orange.png" },
          Low: { url: "https://maps.google.com/mapfiles/ms/icons/green.png" },
        };

        new window.google.maps.Marker({
          position: { lat, lng },
          map,
          icon: severityIcons[article.severity],
          title: `Severity: ${article.severity}`,
        });
      }
    };

    initMap();
  }, [article]);

  if (!article) return null;

  const formattedDate = new Date(article.publisheddate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Modal show={true} onHide={onClose} size="lg" centered scrollable >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>
            <span className={`badge ${article.severity.toLowerCase()} mb-2`}>{article.severity}</span>
          </div>
          {article.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="details-top-header">
          <div className="published-date mb-2">
            <strong>Published Date:</strong> {formattedDate}
          </div>
        </div>
        <div className="published-date mb-2">
          <strong>Location:</strong> {article.location || "Unknown"}
        </div>
        <div className="published-date mb-2">
          <strong>Disruption Type:</strong> {article.disruptiontype}
        </div>
        
        <div ref={mapRef} style={{ width: "100%", height: "250px" }} className="rounded-lg bg-gray-200 mb-4" />
        
        <div className="flex-container mt-2 mb-4">
          <p className="article-text text-justify">{article.text}</p>
          <div className="image-container mt-2">
              <img src={article.imageurl} alt="Article" style={{ width: "350px", height: "250px" }}className="full-image" />
          </div>
        </div>
        
        <div>
          <Button variant="link" href={article.url} target="_blank">
            View Original Article
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArticleDetail;