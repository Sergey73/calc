import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';

import { CalcAction, CalcOperator, CalcValue } from '@constants/index';
import {
  doubleDotValidator,
  operatorWithoutOperandValidator,
  pairedBracketsValidator,
  rightBracketBeforeLeftValidator,
  twoOrMoreOperatorsInRowValidator
} from '@validators/index';
import { ButtonData, CalcEvent } from '@models/index';
import { CalculateService } from '@services/index';
import { TreeComponent } from '@components/index';
import { Util } from '@utils/index';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, TreeComponent, ReactiveFormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit, OnDestroy {
  buttonsData: ButtonData[] = [
    { value: CalcAction.clear, text: 'C', className: 'dark-btn', description: 'сlear', disabled: false },
    { value: CalcOperator.leftBracket, className: 'dark-btn', description: 'left bracket', disabled: false },
    { value: CalcOperator.rightBracket, className: 'dark-btn', description: 'right bracket', disabled: false },
    {
      value: CalcAction.backspace,
      text: '⌫',
      className: 'two-size dark-btn',
      description: 'backspace',
      disabled: false
    },

    { value: CalcValue.seven, description: '', disabled: false },
    { value: CalcValue.eight, description: '', disabled: false },
    { value: CalcValue.nine, description: '', disabled: false },
    { value: CalcOperator.subtraction, className: 'dark-btn', description: 'subtraction', disabled: false },
    { value: CalcOperator.division, className: 'dark-btn', description: 'division', disabled: false },

    { value: CalcValue.four, description: '', disabled: false },
    { value: CalcValue.five, description: '', disabled: false },
    { value: CalcValue.six, description: '', disabled: false },
    { value: CalcOperator.addition, className: 'dark-btn', description: 'addition', disabled: false },
    { value: CalcOperator.multiplication, className: 'dark-btn', description: 'multiplication', disabled: false },

    { value: CalcValue.one, description: '', disabled: false },
    { value: CalcValue.two, description: '', disabled: false },
    { value: CalcValue.three, description: '', disabled: false },
    { value: CalcValue.dot, className: 'dark-btn', description: '', disabled: false },
    { value: CalcOperator.exponent, className: 'dark-btn', description: 'exponent', disabled: false },

    { value: CalcValue.zero, className: 'three-size', description: '', disabled: false },
    {
      value: CalcAction.calculate,
      text: '=',
      className: 'two-size orange-btn',
      description: 'calculate',
      disabled: false
    }
  ];

  form: FormGroup;
  expression: string = '';
  result$: Observable<number>;
  isInvalidExpression$: Observable<boolean>;

  private destroyed$ = new Subject<void>();

  constructor(
    private calculateService: CalculateService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.result$ = this.calculateService.result$;
    this.isInvalidExpression$ = this.calculateService.isInvalidExpressionError$;
    this.createForm();
    this.setBtnRules();
  }

  ngOnDestroy(): void {
    this.calculateService.destroy();
    this.destroyed$.next();
  }

  addValue(value: CalcEvent) {
    this.calculateService.resetExpressionError();
    if (Util.isCalcAction(value)) {
      this.performAction(value as CalcAction);
      return;
    }
    this.addSymbol(value);
  }

  get expressionFormControl() {
    return this.form.get('expressionField');
  }

  get isTwoOrMoreOperatorsInRowError(): boolean {
    return this.expressionFormControl.errors?.['twoOrMoreOperatorsInRow'];
  }

  get isUnpairedNumberBracketsError(): boolean {
    return this.expressionFormControl.errors?.['unpairedNumberBrackets'];
  }

  get isRightBracketBeforeLeftError(): boolean {
    return this.expressionFormControl.errors?.['rightBracketBeforeLeft'];
  }

  get isOperatorWithoutOperandError(): boolean {
    return this.expressionFormControl.errors?.['operatorWithoutOperand'];
  }

  get isDoubleDotError(): boolean {
    return this.expressionFormControl.errors?.['doubleDot'];
  }

  private setBtnRules() {
    this.expressionFormControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((value) => {
      const calculateBtn = this.getButton(CalcAction.calculate);
      const leftBracketBtn = this.getButton(CalcOperator.leftBracket);
      const rightBracketBtn = this.getButton(CalcOperator.rightBracket);
      const subtractionBtn = this.getButton(CalcOperator.subtraction);
      const divisionBtn = this.getButton(CalcOperator.division);
      const additionBtn = this.getButton(CalcOperator.addition);
      const multiplicationBtn = this.getButton(CalcOperator.multiplication);
      const dotBtn = this.getButton(CalcValue.dot);
      const exponentBtn = this.getButton(CalcOperator.exponent);

      const oneBtn = this.getButton(CalcValue.one);
      const twoBtn = this.getButton(CalcValue.two);
      const tgreeBtn = this.getButton(CalcValue.three);
      const fourBtn = this.getButton(CalcValue.four);
      const fiveBtn = this.getButton(CalcValue.five);
      const sixBtn = this.getButton(CalcValue.six);
      const sevenBtn = this.getButton(CalcValue.seven);
      const eightBtn = this.getButton(CalcValue.eight);
      const nineBtn = this.getButton(CalcValue.nine);
      const zeroBtn = this.getButton(CalcValue.zero);

      const operators = [
        leftBracketBtn,
        calculateBtn,
        rightBracketBtn,
        subtractionBtn,
        divisionBtn,
        additionBtn,
        multiplicationBtn,
        dotBtn,
        exponentBtn
      ];

      const digits = [oneBtn, twoBtn, tgreeBtn, fourBtn, fiveBtn, sixBtn, sevenBtn, eightBtn, nineBtn, zeroBtn];

      const lastToken: CalcOperator | CalcValue = ({} = value.slice(-1));

      [...operators, ...digits].forEach((btn) => {
        btn.disabled = false;
      });

      if (!value || lastToken === CalcOperator.leftBracket) {
        [
          calculateBtn,
          rightBracketBtn,
          subtractionBtn,
          divisionBtn,
          additionBtn,
          multiplicationBtn,
          dotBtn,
          exponentBtn
        ].forEach((btn) => {
          btn.disabled = true;
        });
      }

      if (lastToken === CalcOperator.rightBracket) {
        [...digits, dotBtn, leftBracketBtn].forEach((btn) => {
          btn.disabled = true;
        });
      }

      if (
        this.isTwoOrMoreOperatorsInRowError ||
        this.isUnpairedNumberBracketsError ||
        this.isRightBracketBeforeLeftError ||
        this.isOperatorWithoutOperandError ||
        this.isDoubleDotError
      ) {
        calculateBtn.disabled = true;
      }

      if (!isNaN(parseFloat(lastToken))) {
        leftBracketBtn.disabled = true;
      }

      if (lastToken === CalcValue.dot) {
        operators.forEach((btn) => {
          btn.disabled = true;
        });
      }
    });
  }

  private getButton(value: CalcEvent): ButtonData {
    return this.buttonsData.find((btn) => btn.value === value);
  }

  private createForm() {
    this.form = this.fb.group({
      expressionField: this.fb.control(this.expression, [
        twoOrMoreOperatorsInRowValidator(),
        pairedBracketsValidator(),
        rightBracketBeforeLeftValidator(),
        operatorWithoutOperandValidator(),
        doubleDotValidator()
      ])
    });
  }

  private addSymbol(value: string) {
    this.expression += value;
  }

  private performAction(action: CalcAction) {
    if (action === CalcAction.clear) {
      this.expression = '';
      this.calculateService.clearResult();
    }
    if (action === CalcAction.backspace) {
      this.expression = this.expression.slice(0, -1);
      this.calculateService.clearResult();
    }
    if (action === CalcAction.calculate) {
      this.calculateService.calculate(this.expression);
    }
  }
}
