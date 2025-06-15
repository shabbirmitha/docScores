import { Player } from "../Player/playerTypes";

export interface Team {
  id: string;
  _id: string;
  name: string;
  playersId: Player["id"][];
  captainId: Player["id"];
}
