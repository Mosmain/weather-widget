import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon as _FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBars,
  faLocationArrow,
  faArrowsToDot,
  faGear,
  faXmark,
  faTrashCan,
  faArrowTurnUp,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faBars,
  faLocationArrow,
  faArrowsToDot,
  faGear,
  faTrashCan,
  faXmark,
  faArrowTurnUp
);

export { _FontAwesomeIcon as FontAwesomeIcon };