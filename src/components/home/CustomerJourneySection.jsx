import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  Compass,
  Image as ImageIcon,
  PlayCircle,
  RotateCcw,
  X,
} from 'lucide-react';
import './CustomerJourneySection.css';

const JOURNEY_IMAGE_SRC = '/media/customer-journey.jpg';
const STORY_VIDEO_SRC = '/media/story-video.mp4';

/**
 * Interactive Customer Journey Experience section on the GraahakSaarthi homepage.
 * Offers visitors two ways to explore Rahul's 5-stage consumer journey:
 * 1) The complete 5-stage customer journey image ("See Through Image")
 * 2) The 30-second narrated story video with original audio ("Watch the Story Video")
 */
export function CustomerJourneySection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'image' | 'video' | null
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef(null);
  const selectorRef = useRef(null);

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setActiveModal(null);
    setVideoEnded(false);
    setVideoError(false);
  };

  const openImageModal = () => {
    setMenuOpen(false);
    setActiveModal('image');
  };

  const openVideoModal = () => {
    setMenuOpen(false);
    setVideoEnded(false);
    setVideoError(false);
    setActiveModal('video');
  };

  // Ensure video starts from 0:00 with unmuted full audio whenever opened
  useEffect(() => {
    if (activeModal === 'video' && videoRef.current) {
      const el = videoRef.current;
      el.pause();
      el.currentTime = 0;
      el.muted = false;
      el.volume = 1;
    }
  }, [activeModal]);

  // Escape key closes open modals or dropdown menu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (activeModal) {
          closeModal();
        } else if (menuOpen) {
          setMenuOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, menuOpen]);

  // Close compact option panel when clicking outside it
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleOutsideClick = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  const handleReplayVideo = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.muted = false;
    el.volume = 1;
    setVideoEnded(false);
    el.play().catch(() => {});
  };

  return (
    <section
      id="customer-journey-experience"
      className="gs-journey-section"
      aria-labelledby="gs-journey-heading"
    >
      <div className="gs-container">
        <div className="gs-journey-card">
          <h2 id="gs-journey-heading" className="gs-journey-heading">
            See How GraahakSaarthi Makes a Difference
          </h2>

          <p className="gs-journey-description">
            A small consumer problem can become a confusing experience. Follow Rahul&apos;s
            illustrative journey and discover how the right guidance can help consumers move
            forward with confidence.
          </p>

          <div className="gs-journey-control-wrap" ref={selectorRef}>
            <button
              type="button"
              className={`gs-journey-trigger-btn ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="gs-journey-options-panel"
            >
              <Compass size={18} aria-hidden="true" />
              <span>Explore the Customer Journey</span>
              <ChevronDown
                size={17}
                className="gs-journey-trigger-chevron"
                aria-hidden="true"
              />
            </button>

            {menuOpen && (
              <div
                id="gs-journey-options-panel"
                className="gs-journey-options-panel"
                role="region"
                aria-label="Customer journey viewing options"
              >
                <button
                  type="button"
                  className="gs-journey-option-btn"
                  onClick={openImageModal}
                >
                  <span
                    className="gs-journey-option-icon gs-journey-option-icon--navy"
                    aria-hidden="true"
                  >
                    <ImageIcon size={20} />
                  </span>
                  <span className="gs-journey-option-text">
                    <span className="gs-journey-option-title">See Through Image</span>
                    <span className="gs-journey-option-desc">
                      Explore the complete 5-stage customer journey visually.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className="gs-journey-option-btn"
                  onClick={openVideoModal}
                >
                  <span
                    className="gs-journey-option-icon gs-journey-option-icon--green"
                    aria-hidden="true"
                  >
                    <PlayCircle size={20} />
                  </span>
                  <span className="gs-journey-option-text">
                    <span className="gs-journey-option-title">Watch the Story Video</span>
                    <span className="gs-journey-option-desc">
                      Watch Rahul&apos;s 30-second journey with GraahakSaarthi.
                    </span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {activeModal === 'image' &&
        createPortal(
          <div
            className="gs-journey-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="5-Stage Customer Journey Image Viewer"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div className="gs-journey-modal gs-journey-modal--image">
              <div className="gs-journey-modal-header">
                <div className="gs-journey-modal-heading-group">
                  <h3 className="gs-journey-modal-title">
                    5-Stage Customer Journey — Visual Overview
                  </h3>
                  <p className="gs-journey-modal-subtitle">
                    Rahul&apos;s journey with GraahakSaarthi from defective phone to structured grievance.
                  </p>
                </div>

                <button
                  type="button"
                  className="gs-journey-modal-close"
                  onClick={closeModal}
                  aria-label="Close image viewer"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="gs-journey-image-viewport">
                <img
                  src={JOURNEY_IMAGE_SRC}
                  alt="Rahul's 5-stage consumer journey with GraahakSaarthi"
                  className="gs-journey-full-image"
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Video Player Modal */}
      {activeModal === 'video' &&
        createPortal(
          <div
            className="gs-journey-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Rahul's 30-Second Story Video"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div className="gs-journey-modal gs-journey-modal--video">
              <div className="gs-journey-modal-header">
                <div className="gs-journey-modal-heading-group">
                  <h3 className="gs-journey-modal-title">
                    Rahul&apos;s 30-Second Story with GraahakSaarthi
                  </h3>
                  <p className="gs-journey-modal-subtitle">
                    Press Play to watch with narration and sound.
                  </p>
                </div>

                <button
                  type="button"
                  className="gs-journey-modal-close"
                  onClick={closeModal}
                  aria-label="Close story video"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="gs-journey-video-container">
                {videoError ? (
                  <div className="gs-journey-video-fallback" role="alert">
                    <p>
                      We could not load the story video right now. Please check your connection or
                      browser media support and try again.
                    </p>
                    <button
                      type="button"
                      className="gs-journey-replay-btn"
                      onClick={() => {
                        setVideoError(false);
                        if (videoRef.current) videoRef.current.load();
                      }}
                    >
                      <RotateCcw size={16} aria-hidden="true" />
                      <span>Retry Video</span>
                    </button>
                  </div>
                ) : (
                  <div className="gs-journey-video-frame">
                    <video
                      ref={videoRef}
                      className="gs-journey-video-el"
                      src={STORY_VIDEO_SRC}
                      controls
                      playsInline
                      preload="metadata"
                      onEnded={() => setVideoEnded(true)}
                      onPlay={() => setVideoEnded(false)}
                      onError={() => setVideoError(true)}
                    >
                      Your browser does not support HTML5 video playback.
                    </video>
                  </div>
                )}

                {videoEnded && !videoError && (
                  <div className="gs-journey-video-ended-bar">
                    <span>Story playback finished.</span>
                    <button
                      type="button"
                      className="gs-journey-replay-btn"
                      onClick={handleReplayVideo}
                    >
                      <RotateCcw size={15} aria-hidden="true" />
                      <span>Replay Story Video</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
