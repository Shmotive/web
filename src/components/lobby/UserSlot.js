import "../../assets/css/lobby.css";
import Image from "react-bootstrap/Image";

import userIcons from "../../assets/user_icons/userIcons";

export default function UserSlot({ name, index }) {
  return (
    <div className="members">
      <Image
        src={userIcons[index % userIcons.length]}
        width={70}
        style={{ filter: name ? "none" : "grayscale(100%)" }}
      />
      {name}
    </div>
  );
}
