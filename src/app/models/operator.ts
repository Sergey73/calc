import { CalcOperator } from '@constants/index';
import { OperatorFunc } from './operator-func';

export class Operator {
  value: CalcOperator;
  func: OperatorFunc;
  priority: number;

  constructor(value: CalcOperator, priority: number, func: OperatorFunc = null) {
    this.value = value;
    this.priority = priority;
    this.func = func;
  }
}
