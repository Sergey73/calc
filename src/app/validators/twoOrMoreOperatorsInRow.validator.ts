import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { CalcOperator } from '@constants/index';
import { CalcValue } from '@constants/index';

export function twoOrMoreOperatorsInRowValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const operators: string[] = [
      CalcOperator.subtraction,
      CalcOperator.division,
      CalcOperator.addition,
      CalcOperator.multiplication,
      CalcOperator.exponent,
      CalcValue.dot
    ];
    let count = 0;
    const expression = control.value as string;

    for (let i = 0; i < expression.length; i++) {
      const token = expression[i];
      count = operators.includes(token) ? (count += 1) : 0;
      if (count > 1) break;
    }

    return count > 1 ? { twoOrMoreOperatorsInRow: true } : null;
  };
}
