/**
 * Calculator : 계산기 동작 js 
 */

 document.addEventListener('DOMContentLoaded',function(){
     
     // 화면 열릴때 초 계산기 값 초기화
     const inputCalculator = document.querySelector('input#inputCalculator');
     inputCalculator.value='';
     
     // 버튼들 찾기
     const one = document.querySelector('button#btnCalculatorOne');
     const tow = document.querySelector('button#btnCalculatorTwo');
     const three = document.querySelector('button#btnCalculatorTree');
     const four = document.querySelector('button#btnCalculatorFour');
     const five = document.querySelector('button#btnCalculatorFive');
     const six = document.querySelector('button#btnCalculatorSix');
     const seven = document.querySelector('button#btnCalculatorSeven');
     const eight = document.querySelector('button#btnCalculatorEight');
     const nine = document.querySelector('button#btnCalculatorNine');
     const zero = document.querySelector('button#btnCalculatorZero');
     
     const btnD = document.querySelector('button#btnCalculatorD');
     const btnC = document.querySelector('button#btnCalculatorC');
     
     // 이벤트
     one.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'1';
     });
     tow.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'2';
     });
     three.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'3';
     });
     four.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'4';
     });
     five.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'5';
     });
     six.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'6';
     });
     seven.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'7';
     });
     eight.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'8';
     });
     nine.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'9';
     });
     zero.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value+'0';
     });
     
     btnD.addEventListener('click',function(){
         inputCalculator.value = inputCalculator.value.slice(0,-1);
     });
     
     btnC.addEventListener('click',function(){
         inputCalculator.value = '';
     });
     
 });