import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://static.vecteezy.com/system/resources/previews/036/214/523/non_2x/ai-generated-empty-supermarket-cart-on-blue-background-ready-for-shopping-generated-by-ai-free-photo.jpg",
  "https://images-eu.ssl-images-amazon.com/images/G/31/img19/SiddMiniTV/BKB_RighRes._CB803678285_.jpg",
  "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Isha/Xiaomi/Redmi15Aug/D275968354_IN_WLD_Redmi15_New-Launch_Tall_Hero_3000x1200._CB802505031_.jpg",
  "https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/dharshini/Monsoon_Heros_3000X1200_AC_2x-22ndAUG._CB802839283_.jpg",
  "https://m.media-amazon.com/images/G/31/AmazonDevices/echo/Hypnos-alexa_page_banner.png",
  "https://m.media-amazon.com/images/G/31/img21/Watches2024/Dec/Travelstore/AF/PC._CB539736676_.jpg",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div
      style={{
        width: "100%",
        height: "420px",
        overflow: "hidden",
        position: "relative",
        margin: "30px 0",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ✅ Only current image is visible */}
      <img
        src={images[currentIndex]}
        alt="Slideshow"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // ✅ properly fit image
          borderRadius: "12px",
          transition: "opacity 0.8s ease-in-out",
          backgroundColor: "#f5f5f5",
        }}
      />

      {/* ✅ Left Arrow */}
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          top: "50%",
          left: "15px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          border: "none",
          borderRadius: "50%",
          padding: "8px",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <ChevronLeft size={28} />
      </button>

      {/* ✅ Right Arrow */}
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          top: "50%",
          right: "15px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          border: "none",
          borderRadius: "50%",
          padding: "8px",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <ChevronRight size={28} />
      </button>

      {/* ✅ Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "15px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              height: currentIndex === index ? "12px" : "10px",
              width: currentIndex === index ? "12px" : "10px",
              borderRadius: "50%",
              display: "inline-block",
              cursor: "pointer",
              backgroundColor: currentIndex === index ? "#111" : "#bbb",
              transition: "all 0.3s ease",
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
