import { CalcNodeValue } from './calc-node-value';
import { RpnData } from './rpn-data';

export interface CalcNode {
  value: CalcNodeValue;
  func: boolean;
  children: [CalcNode, CalcNode]
  name: RpnData;
}
