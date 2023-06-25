import { CalculatorClosure } from "./calculator";

export interface IbinaryOperation {
  readonly add: object;
  readonly sub: string;
  readonly mul: string;
  readonly div: string;
}
export interface IunitaryOperation {
  readonly square: string;
}

export function exectueOperation (closure: CalculatorClosure) {
  if (closure.currentOperation in binaryOperation) {
    binaryOperation[closure.currentOperation as keyof IbinaryOperation].action(closure)
  }
  if (closure.currentOperation in unitaryOperation) {
    unitaryOperation[closure.currentOperation as keyof IunitaryOperation].action(closure)
  }
}

export function getOperationSymbol (closure: CalculatorClosure): string {
  if (closure.currentOperation in binaryOperation) {
    return binaryOperation[closure.currentOperation as keyof IbinaryOperation].symbol
  }
  if (closure.currentOperation in unitaryOperation) {
    return unitaryOperation[closure.currentOperation as keyof IunitaryOperation].symbol
  }
  throw new Error()
}

export function getOperationType (operation: string): string {
  if (operation in binaryOperation) {
    return 'binary'
  }
  if (operation in unitaryOperation) {
    return 'unitary'
  }
  return ''
}

export const binaryOperation = {
  add: {
    action (closure: CalculatorClosure) {
      const firstOperand = Number(closure.accumulatedNumber || '0')
      const seccondOperand = Number(closure.currentNumber || '0')
      closure.accumulatedNumber = String(firstOperand + seccondOperand)
      closure.currentNumber = ''
    },
    symbol: '+'
  },
  sub: {
    action (closure: CalculatorClosure) {
      const firstOperand = Number(closure.accumulatedNumber || '0')
      const seccondOperand = Number(closure.currentNumber || '0')
      closure.accumulatedNumber = String(firstOperand - seccondOperand)
      closure.currentNumber = ''
    },
    symbol: '-'
  },
  mul: {
    action (closure: CalculatorClosure) {
      const firstOperand = Number(closure.accumulatedNumber || '0')
      const seccondOperand = Number(closure.currentNumber || '0')
      closure.accumulatedNumber = String(firstOperand * seccondOperand)
      closure.currentNumber = ''
    },
    symbol: '*'
  },
  div: {
    action (closure: CalculatorClosure) {
      const firstOperand = Number(closure.accumulatedNumber || '0')
      const seccondOperand = Number(closure.currentNumber || '0')
      closure.accumulatedNumber = String(firstOperand / seccondOperand)
      closure.currentNumber = ''
    },
    symbol: '/'
  },
}
  
export const unitaryOperation = {
  square: {
    action (closure: CalculatorClosure) {
      const operand = Number(closure.currentNumber || '0')
      closure.accumulatedNumber = String(Math.pow(operand, 2))
      closure.currentNumber = ''
    },
    symbol: '^ \u00b2'
  }
}  