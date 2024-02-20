import { CalcEvent } from "./calc-event";

export interface ButtonData {
  value: CalcEvent;
  disabled: boolean;
  text?: string;
  className?: string;
  description?: string;
}
