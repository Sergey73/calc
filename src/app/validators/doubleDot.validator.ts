import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { CalcOperator } from '@constants/index';
import { CalcValue } from '@constants/index';

export function doubleDotValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const operators: string[] = [
      CalcOperator.rightBracket,
      CalcOperator.subtraction,
      CalcOperator.division,
      CalcOperator.addition,
      CalcOperator.multiplication,
      CalcOperator.exponent
    ];
    let isError: boolean = false;
    let isDot: boolean = false;

    const expression = control.value as string;

    for (let i = 0; i < expression.length; i++) {
      const token = expression[i];

      if (token === CalcValue.dot) {
        if (isDot) {
          isError = true;
          break;
        }
        isDot = true;
      }
      if (operators.includes(token)) {
        isDot = false;
      }
    }

    return isError ? { doubleDot: true } : null;
  };
}
