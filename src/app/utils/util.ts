import { CalcAction, CalcOperator, CalcValue } from '@constants/index';
import { CalcEvent } from '@models/index';

export class Util {
  static isCalcAction(value: CalcEvent): boolean {
    return this.isValueMatchesType<typeof CalcAction>(value, CalcAction);
  }

  static isCalcOperation(value: CalcEvent): boolean {
    return this.isValueMatchesType<typeof CalcOperator>(value, CalcOperator);
  }

  static isCalcValue(value: CalcEvent): boolean {
    return this.isValueMatchesType<typeof CalcValue>(value, CalcValue);
  }

  private static isValueMatchesType<T>(value: CalcEvent, type: T): boolean {
    const values = Object.values(type) as string[];
    return values.includes(value);
  }
}
