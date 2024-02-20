import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { CalcOperator } from '@constants/index';

export function pairedBracketsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const expression = control.value as string;
    let countLeft = 0;
    let countRight = 0;

    for (let i = 0; i < expression.length; i++) {
      const token = expression[i];
      if (token === CalcOperator.leftBracket) { countLeft +=1};
      if (token === CalcOperator.rightBracket) { countRight +=1};
    }

    return countLeft !== countRight ? { unpairedNumberBrackets: true } : null;
  };
}
