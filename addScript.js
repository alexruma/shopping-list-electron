
let form =document.getElementById('form')
console.log('script it')
document.getElementById('submit').addEventListener('click', ()=>
{
  let itemVal=document.getElementById('item').value;
  let testText=document.createElement('div');
  testText.innerText=itemVal;
  form.appendChild(testText)
  console.log(itemVal);

})
