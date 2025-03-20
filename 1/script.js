const input1 = document.querySelector('#val1');
const input2 = document.querySelector('#val2');
const input3 = document.querySelector('#val3');
const input4 = document.querySelector('#val4');
const mainContainer = document.querySelector('main');
const resultsContainer = document.querySelector('#results')
const button = document.querySelector('#count');
const add = document.querySelector('#add');
const del = document.querySelector('#delete');

let count = 4
const inputs = [input1,input2,input3,input4]

button.addEventListener('click', () => {
    const input1Value = +input1.value;
    const input2Value = +input2.value;
    const input3Value = +input3.value;
    const input4Value = +input4.value;
    
    const minValue = Math.min(input1Value, input2Value, input3Value, input4Value);
    const maxValue = Math.max(input1Value, input2Value, input3Value, input4Value);
    const sumValue = input1Value + input2Value + input3Value + input4Value;
    const avgValue = sumValue / 4;
    resultsContainer.textContent = `Min: ${minValue}, Max: ${maxValue}, Sum: ${sumValue}, Avg: ${avgValue}`;

    
});

inputs.forEach(input => {
    input.addEventListener('input', updateValues);
});

add.addEventListener('click', ()=>{
    const input = document.createElement("input");
    input.type = 'number'
    input.setAttribute('name','input' + count)
    mainContainer.appendChild(input);
    inputs.push(input);
    input.addEventListener('input',updateValues);
    count++;
})

function updateValues() {
    const values = Array.from(inputs).map(input => +input.value);
    
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const sumValue = values.reduce((sum, value) => sum + value, 0);
    const avgValue = sumValue / values.length;
    
    resultsContainer.textContent = `Min: ${minValue}, Max: ${maxValue}, Sum: ${sumValue}, Avg: ${avgValue}`;
}