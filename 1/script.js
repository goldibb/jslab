const input1 = document.querySelector('#val1');
const input2 = document.querySelector('#val2');
const input3 = document.querySelector('#val3');
const input4 = document.querySelector('#val4');
const mainContainer = document.querySelector('main');
const button = document.querySelector('button');
button.addEventListener('click', () => {
    const input1Value = +input1.value;
    const input2Value = +input2.value;
    const input3Value = +input3.value;
    const input4Value = +input4.value;
    
    const minValue = Math.min(input1Value, input2Value, input3Value, input4Value);
    const maxValue = Math.max(input1Value, input2Value, input3Value, input4Value);
    const sumValue = input1Value + input2Value + input3Value + input4Value;
    const avgValue = sumValue / 4;
    mainContainer.textContent = `Min: ${minValue}, Max: ${maxValue}, Sum: ${sumValue}, Avg: ${avgValue}`;

    
});

[input1,input2,input3,input4].forEach(input => {
   input.addEventListener('input', () => {
    const input1Value = +input1.value;
    const input2Value = +input2.value;
    const input3Value = +input3.value;
    const input4Value = +input4.value;
    
    const minValue = Math.min(input1Value, input2Value, input3Value, input4Value);
    const maxValue = Math.max(input1Value, input2Value, input3Value, input4Value);
    const sumValue = input1Value + input2Value + input3Value + input4Value;
    const avgValue = sumValue / 4;
    mainContainer.textContent = `Min: ${minValue}, Max: ${maxValue}, Sum: ${sumValue}, Avg: ${avgValue}`;
   });
});
