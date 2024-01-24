import "../../assets/css/lobby.css";
import Image from "react-bootstrap/Image";

const userIcons = [require("../../assets/shrug-smiley.jpg")];

export default function UserSlot({ name, index }) {
  return (
    <div className="members">
      <Image src={userIcons[index % userIcons.length]} width={100} />
      {name}
    </div>
  );
}
