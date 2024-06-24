const sayHiButton = document.getElementById('button-1');
const mainContent = document.querySelector('main')
const toggleClassButton = document.getElementById('toggleClass');


sayHiButton.addEventListener('click', () => {
    const newContent = document.createElement('p');
    newContent.textContent = 'Hi! I am Darol.';
    mainContent.appendChild(newContent);
})

toggleClassButton.addEventListener('click', () => {
    mainContent.classList.toggle('highlight');
});