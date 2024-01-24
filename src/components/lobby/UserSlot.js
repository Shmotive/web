import "../../assets/css/lobby.css";
import Image from "react-bootstrap/Image";
// import { icon1 as Icon1 } from "../../assets/user_icons/icon1.svg";
// import { icon2 as Icon2 } from "../../assets/user_icons/icon2.svg";
// import { icon3 as Icon3 } from "../../assets/user_icons/icon3.svg";
// import { icon4 as Icon4 } from "../../assets/user_icons/icon4.svg";
// import { icon5 as Icon5 } from "../../assets/user_icons/icon5.svg";
// import { icon6 as Icon6 } from "../../assets/user_icons/icon6.svg";
// import { icon7 as Icon7 } from "../../assets/user_icons/icon7.svg";
// import { icon8 as Icon8 } from "../../assets/user_icons/icon8.svg";
import Icon1 from "../../assets/user_icons/icon1.svg";
import Icon2 from "../../assets/user_icons/icon2.svg";
import Icon3 from "../../assets/user_icons/icon3.svg";
import Icon4 from "../../assets/user_icons/icon4.svg";
import Icon5 from "../../assets/user_icons/icon5.svg";
import Icon6 from "../../assets/user_icons/icon6.svg";
import Icon7 from "../../assets/user_icons/icon7.svg";
import Icon8 from "../../assets/user_icons/icon8.svg";

// const userIcons = [require("../../assets/user_icons/shrug-smiley.jpg")];
const userIcons = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7, Icon8];
export default function UserSlot({ name, index }) {
  return (
    <div className="members">
      <Image src={userIcons[index % userIcons.length]} width={60} />
      {name}
    </div>
  );
}
