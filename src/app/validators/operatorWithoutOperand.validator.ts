import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { CalcOperator } from '@constants/index';

export function operatorWithoutOperandValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const operators: string[] = [
      CalcOperator.subtraction,
      CalcOperator.division,
      CalcOperator.addition,
      CalcOperator.multiplication,
      CalcOperator.exponent
    ];
    let isError: boolean = false;
    const expression = control.value as string;

    for (let i = 0; i < expression.length; i++) {
      const token = expression[i];
      const nextToken = expression[i + 1];

      if (operators.includes(token) && (!nextToken || nextToken === CalcOperator.rightBracket)) {
        isError = true;
        break;
      }
    }

    return isError ? { operatorWithoutOperand: true } : null;
  };
}
