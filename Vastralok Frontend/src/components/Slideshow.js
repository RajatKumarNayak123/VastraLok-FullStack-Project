import React, { useEffect, useState } from "react";

const Slideshow = () => {
  const images = [
    "https://picsum.photos/id/1018/1200/400",
    "https://picsum.photos/id/1015/1200/400",
    "https://picsum.photos/id/1019/1200/400",
    "https://picsum.photos/id/1020/1200/400"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // har 3 sec me slide change hoga
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div style={{ width: "100%", overflow: "hidden", marginBottom: "20px" }}>
      <img
        src={images[currentIndex]}
        alt="Slideshow"
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          borderRadius: "12px",
          transition: "opacity 0.5s ease-in-out"
        }}
      />
    </div>
  );
};

export default Slideshow;
