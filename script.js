const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const dateBox = document.getElementById('date-box');
const priorityBox = document.getElementById('priority-box');

function addTask(){
    if(inputBox.value === ''){
        alert('You must write something!');
    }
    else{
        let li = document.createElement('li');
        let taskContent = inputBox.value;
        if (priorityBox.value) taskContent += `<small>${priorityBox.value}</small>`;
        if (dateBox.value) taskContent += `<small>🗓️${dateBox.value}</small>`
        li.innerHTML = taskContent;
        li.setAttribute('draggable', 'true');
        listContainer.prepend(li);
        let span = document.createElement('span');
        span.innerHTML = '\u00d7';
        li.appendChild(span);
    }
    inputBox.value = '';
    dateBox.value = '';
    priorityBox.value = '';
    saveData();
}
inputBox.addEventListener('keypress', function(event) {
    if (event.key ==='Enter') {
        event.preventDefault();
        addTask();
    }
});
listContainer.addEventListener('click', function(e){
    if (e.target.tagName === 'LI'){
        e.target.classList.toggle('checked');
        saveData();
    }
    else if(e.target.tagName === 'SPAN'){
        e.target.parentElement.remove();
        saveData();
    }

}, false);

function searchTasks(){
    let filter = document.getElementById('search-box').value.toLowerCase();
    let tasks = listContainer.getElementsByTagName('li');

    for (let i = 0; i < tasks.length; i++){
        let textValue = tasks[i].textContent || tasks[i].innerText;
        if (textValue.replace('\u00d7', '').toLowerCase().indexOf(filter) > -1){
            tasks[i].style.display = '';
        }
        else{
            tasks[i].style.display = 'none';
        }
    }
}

function change(){
    document.body.classList.toggle('dark-theme');
    let themeIcon = document.getElementById('dark-mode');
    if (document.body.classList.contains('dark-theme')){
        themeIcon.innerText='☀️';
        localStorage.setItem('theme', 'dark');
    }
    else{
        themeIcon.innerText='🌙';
        localStorage.setItem('theme', 'light');
    }
}

let draggedItem = null;
listContainer.addEventListener('dragstart', function(e){
    if (e.target.tagName === 'LI') {
        draggedItem = e.target;
        setTimeout(() => e.target.classList.add('dragging'), 0);
    }
});
listContainer.addEventListener('dragend', function(e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.remove('dragging');
        draggedItem = null;
        saveData();
    }
});

listContainer.addEventListener('dragover', function(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(listContainer, e.clientY);
    if (draggedItem) {
        if (afterElement == null) {
            listContainer.appendChild(draggedItem, afterElement);
        } else{
            listContainer.insertBefore(draggedItem, afterElement);
        }
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y -box.top -box.height /2;
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child};
        } else{
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY} ).element;
}

function saveData(){
    localStorage.setItem('data', listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem('data');

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('dark-mode').innerText='☀️';
    }
}

showTask();