<template>
  <div class="calculator">
    <div class="display">
      <span>{{ $calculator.operationFormula }}</span>
    </div>
    <input
      class="display currentNumber"
      type="text"
      :value="$calculator.closureStack[0].currentNumber || $calculator.closureStack[0].accumulatedNumber"
      readonly
    />
    <button @click="$calculator.memoryLoad">MR</button>
    <button @click="$calculator.memorySave">MS</button>
    <button @click="$calculator.clearEntry">CE</button>
    <button @click="$calculator.deleteDigit">&#9003;</button>
    <button @click="$calculator.openParenthesis">(</button>
    <button @click="$calculator.closeParenthesis">)</button>
    <button @click="$calculator.setOperation('square')">x&#178;</button>
    <button @click="$calculator.setOperation('div')">/</button>
    <button @click="$calculator.addDigit('7')">7</button>
    <button @click="$calculator.addDigit('8')">8</button>
    <button @click="$calculator.addDigit('9')">9</button>
    <button @click="$calculator.setOperation('mul')">*</button>
    <button @click="$calculator.addDigit('4')">4</button>
    <button @click="$calculator.addDigit('5')">5</button>
    <button @click="$calculator.addDigit('6')">6</button>
    <button @click="$calculator.setOperation('sub')">-</button>
    <button @click="$calculator.addDigit('1')">1</button>
    <button @click="$calculator.addDigit('2')">2</button>
    <button @click="$calculator.addDigit('3')">3</button>
    <button @click="$calculator.setOperation('add')">+</button>
    <button @click="$calculator.swapSign">&#177;</button>
    <button @click="$calculator.addDigit('0')">0</button>
    <button @click="$calculator.startDecimal">,</button>
    <button @click="$calculator.resolveOperation">=</button>
  </div>
</template>

<script setup lang="ts">
import { useCalculator } from './store/calculator';
const $calculator = useCalculator()
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.calculator {
  max-width: 200px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.display {
  grid-column: span 4;
}

.calculator > button {
  margin: 2px;
}

.display.currentNumber {
  border: none;
  background-color: lightgray;
  height: 30px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 2em;
}
</style>
