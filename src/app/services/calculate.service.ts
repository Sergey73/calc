import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { CalcOperator, CalcValue } from '@constants/index';
import { CalcNode, CalcNodeValue, Operator, OperatorFunc, RpnData, Token } from '@models/index';
import { Util } from '@utils/index';

@Injectable({
  providedIn: 'root'
})
export class CalculateService {
  operators: Operator[];

  isInvalidExpressionError$ = new BehaviorSubject<boolean>(false);
  tree$ = new BehaviorSubject<CalcNode>(null);
  result$ = new BehaviorSubject<number>(null);

  private destroyed$ = new Subject<void>();

  constructor() {
    this.operators = [
      new Operator(CalcOperator.leftBracket, 1),
      new Operator(CalcOperator.rightBracket, 1),
      new Operator(
        CalcOperator.subtraction,
        2,
        (leftOperand: number, rightOperand: number): number => leftOperand - rightOperand
      ),
      new Operator(
        CalcOperator.addition,
        2,
        (leftOperand: number, rightOperand: number): number => leftOperand + rightOperand
      ),
      new Operator(
        CalcOperator.division,
        3,
        (leftOperand: number, rightOperand: number): number => leftOperand / rightOperand
      ),
      new Operator(
        CalcOperator.multiplication,
        3,
        (leftOperand: number, rightOperand: number): number => leftOperand * rightOperand
      ),
      new Operator(CalcOperator.exponent, 4, (leftOperand: number, rightOperand: number): number =>
        Math.pow(leftOperand, rightOperand)
      )
    ];
  }

  calculate(tokens: string): void {
    this.resetExpressionError()
    const rpn = this.createReversePolishNotation(tokens);

    if (rpn) {
      const tree = this.createTree(rpn);
      this.getResult(tree);
    } else {
      this.isInvalidExpressionError$.next(true);
    }
  }

  createReversePolishNotation(tokens: string): RpnData[] {
    if (!tokens) return null;

    const queue: RpnData[] = [];
    const operatorsStack: CalcOperator[] = [];
    let temp: string = '';

    if (!tokens) return null;

    const tokensLength = tokens.length;
    for (let i = 0; i < tokensLength; i++) {
      const token = tokens[i] as Token;

      if (this.isNumber(token)) {
        temp = token;
        if (i < tokensLength - 1) {
          while (this.isNumber(tokens[i + 1] as Token)) {
            temp = temp + tokens[i + 1];
            i++;
          }
        }
        const num = parseFloat(temp);
        if (isNaN(num)) return null;
        queue.push(num);
        continue;
      }

      if (Util.isCalcOperation(token as CalcOperator)) {
        const currentOperator: CalcOperator = token as CalcOperator;

        if (operatorsStack.length === 0) {
          operatorsStack.push(currentOperator);
          continue;
        }

        if (currentOperator === CalcOperator.leftBracket) {
          operatorsStack.push(currentOperator);
          continue;
        }

        if (currentOperator === CalcOperator.rightBracket) {
          while (operatorsStack.at(-1) !== CalcOperator.leftBracket) {
            queue.push(operatorsStack.pop());
          }
          operatorsStack.pop();
          continue;
        }

        if (this.getOperatorData(operatorsStack.at(-1)).priority < this.getOperatorData(currentOperator).priority) {
          operatorsStack.push(currentOperator);
          continue;
        } else {
          while (
            this.getOperatorData(operatorsStack.at(-1)).priority >= this.getOperatorData(currentOperator).priority
          ) {
            queue.push(operatorsStack.pop());
            if (!operatorsStack.length) break;
          }
          operatorsStack.push(currentOperator);
          continue;
        }
      }
      return null;
    }

    while (operatorsStack.length) {
      queue.push(operatorsStack.pop());
    }

    return queue;
  }

  createTree(data: RpnData[]): CalcNode {
    if (!data) return null;

    const stack: CalcNode[] = [];
    let node: CalcNode = null;

    data.forEach((value: RpnData) => {
      if (!isNaN(Number(value))) {
        node = this.createCalcNode(value as number, false);
      } else {
        const func = this.getOperatorData(value as CalcOperator).func;
        node = this.createCalcNode(func, true);
        const right = stack.pop();
        const left = stack.pop();
        node.children = [left, right];
      }
      node.name = value;
      stack.push(node);
    });
    const tree = stack.pop();
    this.tree$.next(tree);

    return tree;
  }

  getResult(tree: CalcNode): number {
    if (!tree) return null;

    const result = tree.func
      ? (tree.value as OperatorFunc)(this.getResult(tree.children[0]), this.getResult(tree.children[1]))
      : (tree.value as number);
    this.result$.next(result);

    return result;
  }

  clearResult(): void {
    this.tree$.next(null);
    this.result$.next(null);
  }

  resetExpressionError() {
    this.isInvalidExpressionError$.next(false)
  }

  destroy() {
    this.destroyed$.next();
  }

  private isNumber(value: Token): boolean {
    return Number.isInteger(Number(value)) || value === CalcValue.dot;
  }

  private createCalcNode(value: CalcNodeValue, func: boolean): CalcNode {
    return {
      value,
      func,
      children: null,
      name: null
    };
  }

  private getOperatorData(value: CalcOperator): Operator {
    return this.operators.find((operator) => operator.value === value);
  }
}
