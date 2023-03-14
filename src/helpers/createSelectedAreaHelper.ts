import { ISelectedArea } from "../types/ISelectedArea";
import { ITimeStamp } from "../types/ITimeStamp";

export default (stamp: ITimeStamp): ISelectedArea => {
  const newDiv = document.createElement('div')
  newDiv.style.cssText = `
    position: absolute;
    top: ${stamp.zone.top}px;
    left: ${stamp.zone.left}px;
    width: ${stamp.zone.width}px;
    height: ${stamp.zone.height}px;
    box-sizing: border-box;
    border: 4px solid blue;
  `
  return {
    id: stamp.id,
    area: newDiv
  }
}