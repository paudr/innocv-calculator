import { defineStore } from 'pinia'
import { exectueOperation, getOperationSymbol, getOperationType } from './operations'

export type CalculatorState = {
  closureStack: [CalculatorClosure],
  operationFormulaStored: string,
  operationFormulaActual: string,
  storedNumber: string
}

export type CalculatorClosure = {
  currentNumber: string,
  accumulatedNumber: string,
  currentOperation: string,
  currentOperationSign: string,
}

function createEmptyClosure(): CalculatorClosure {
  return {
    currentNumber: '',
    accumulatedNumber: '',
    currentOperation: '',
    currentOperationSign: '',
  } as CalculatorClosure
}

export const useCalculator = defineStore({
  id: 'calculator',
  state: () => ({
    closureStack: [createEmptyClosure()],
    operationFormulaStored: '',
    operationFormulaActual: '',
    storedNumber: ''
  } as CalculatorState),
  getters: {
    operationFormula (state: CalculatorState) {
      const parts = [
        state.operationFormulaStored,
        state.operationFormulaActual
      ].filter(part => part)
      return parts.join(' ')
    }
  },
  actions: {
    addDigit(digit: string) {
      const newValue = this.closureStack[0].currentNumber + digit
      const withoutLeftZeroes = newValue.replace(/^0*/, '') || '0'
      const cleanValue = withoutLeftZeroes.startsWith(',') ? '0' + withoutLeftZeroes : withoutLeftZeroes
      this.closureStack[0].currentNumber = cleanValue
    },
    deleteDigit () {
      this.closureStack[0].currentNumber = this.closureStack[0].currentNumber.substring(0, this.closureStack[0].currentNumber.length - 1) || '0'
    },
    swapSign () {
      if (this.closureStack[0].currentNumber && this.closureStack[0].currentNumber !== '0') {
        if (this.closureStack[0].currentNumber.startsWith('-')) {
          this.closureStack[0].currentNumber = this.closureStack[0].currentNumber.substring(1)
        } else {
          this.closureStack[0].currentNumber = '-' + this.closureStack[0].currentNumber
        }
      }
    },
    startDecimal () {
      if (!this.closureStack[0].currentNumber) {
        this.closureStack[0].currentNumber = '0,'
      } else if (!this.closureStack[0].currentNumber.includes(',')) {
        this.closureStack[0].currentNumber = this.closureStack[0].currentNumber + ','
      }
    },
    clearEntry () {
      if (this.closureStack[0].currentNumber) {
        this.closureStack[0].currentNumber = ''
      } else {
        this.closureStack.splice(0, this.closureStack.length)
        this.closureStack.unshift(createEmptyClosure())
        this.operationFormulaStored = ''
        this.operationFormulaActual = ''
      }
    },
    setOperation (operation: string) {
      const operationType = getOperationType(operation)
      if (operationType === 'binary') {
        this.setOperationBinary(operation)
      } else if (operationType === 'unitary') {
        this.setOperationUnitary(operation)
      }
    },
    setOperationBinary (operation: string) {
      if (!this.closureStack[0].accumulatedNumber) {
        this.closureStack[0].accumulatedNumber = this.closureStack[0].currentNumber
        this.closureStack[0].currentNumber = ''
        this.closureStack[0].currentOperation = operation
        if (this.closureStack.length === 1) {
          this.operationFormulaStored = String(this.closureStack[0].accumulatedNumber)
        } else {
          this.operationFormulaStored += String(this.closureStack[0].accumulatedNumber)
        }
      } else {
        if (this.closureStack[0].currentNumber) {
          this.operationFormulaStored += `${this.operationFormulaActual} ${this.closureStack[0].currentNumber}`
          exectueOperation(this.closureStack[0])
        }
        this.closureStack[0].currentOperation = operation
      }
      this.operationFormulaActual = ` ${getOperationSymbol(this.closureStack[0])}`
    },
    setOperationUnitary(operation: string) {
      if (this.closureStack[0].currentNumber) {
        const value = this.closureStack[0].currentNumber
        this.closureStack.unshift(createEmptyClosure())
        this.closureStack[0].currentNumber = value
        this.closureStack[0].currentOperation = operation

        this.operationFormulaStored += ` ${this.closureStack[0].currentNumber} ${getOperationSymbol(this.closureStack[0])}`
        exectueOperation(this.closureStack[0])

        const closure = this.closureStack.shift() as CalculatorClosure
        this.closureStack[0].currentNumber = ''

        if (this.closureStack[0].currentOperation) {
          this.closureStack[0].currentNumber = closure.accumulatedNumber
          exectueOperation(this.closureStack[0])
        } else {
          this.closureStack[0].accumulatedNumber = closure.accumulatedNumber
        }

        this.closureStack[0].currentOperation = ''
      }
    },
    resolveOperation () {
      if (this.closureStack[0].currentNumber && this.closureStack[0].currentOperation) {
          this.operationFormulaStored += `${this.operationFormulaActual} ${this.closureStack[0].currentNumber}`
          exectueOperation(this.closureStack[0])
          this.operationFormulaActual = ''
          this.closureStack[0].currentOperation = ''
      }
    },
    openParenthesis () {
      if (this.closureStack[0].currentOperation) {
        this.operationFormulaStored += ` ${getOperationSymbol(this.closureStack[0])} ( `
        this.operationFormulaActual = ''
        this.closureStack.unshift(createEmptyClosure())
      }
    },
    closeParenthesis () {
      if (this.closureStack.length > 1) {
        if (this.closureStack[0].currentNumber) {
          if (this.closureStack[0].currentOperation) {
            this.operationFormulaStored += `${this.operationFormulaActual} ${this.closureStack[0].currentNumber}`
            exectueOperation(this.closureStack[0])
            this.operationFormulaActual = ''
            this.closureStack[0].currentOperation = ''
          } else {
            this.operationFormulaStored += `${this.closureStack[0].currentNumber}`
            this.closureStack[0].accumulatedNumber = this.closureStack[0].currentNumber
            this.closureStack[0].currentNumber = ''
          }
        }
        this.operationFormulaStored += ' )'
        const oldStak = this.closureStack.shift() as CalculatorClosure
        this.closureStack[0].currentNumber = oldStak.accumulatedNumber
        exectueOperation(this.closureStack[0])
      }
    },
    memoryLoad () {
      this.closureStack[0].currentNumber = this.storedNumber
    },
    memorySave () {
      this.storedNumber = this.closureStack[0].currentNumber
    },
  },
})
