import React from "react";
import Trophy from "./Trophy";
import placeholderImage from "../../assets/voting_backgrounds/placeholder.png";
import diningImage from "../../assets/voting_backgrounds/dining.png";
import activityImage from "../../assets/voting_backgrounds/activity.webp";

const CATEGORY_IMAGE = {
  DINING: diningImage,
  CUSTOM: placeholderImage,
  ACTIVITY: activityImage,
};
const ResultCard = ({ name, position, category }) => {
  const styling = {
    0: { color: "gold", size: 12 },
    1: { color: "#888", size: 10 },
    2: { color: "chocolate", size: 8 },
    other: { color: "#eee", size: 5 },
  };
  return (
    <div>
      <div
        style={{
          // ...styling[position],
          border: `5px solid ${styling[position].color}`,
          borderRadius: "24px",
          width: `${styling[position].size}em`,
          height: `${styling[position].size}em`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
          padding: "1em",
          gap: "1em",
          position: "relative",
        }}
      >
        {category && (
          <div
            style={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${
                CATEGORY_IMAGE[category] ?? placeholderImage
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center 90%",
              backgroundRepeat: "no-repeat",
              opacity: 0.7, // Set the opacity for the background
              borderRadius: "20px",
              zIndex: -1, // Ensure the background is behind the content
            }}
          />
        )}
        <Trophy
          color={styling[position].color}
          size={styling[position].size * 3}
        />
      </div>
      <div
        style={{
          fontSize: `${styling[position].size * 2}px`,
          opacity: 1,
          padding: "0.5rem",
          textAlign: "center",
          maxWidth: `${styling[position].size}em`,
          textWrap: "pretty",
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default ResultCard;
