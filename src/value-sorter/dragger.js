let dragAreaInit = false;
let dropCallback;

//////////////////////////////////////////
// Initialize value cards (draggable items)
//////////////////////////////////////////

function setDropCallback(callback) {
    dropCallback = callback;
}


//////////////////////////////////////////
// Initialize drop zones (droppable areas)
//////////////////////////////////////////
let upper, middle, lower;

function initDropZones() {
    upper = document.getElementById("upper");
    middle = document.getElementById("middle");
    lower = document.getElementById("lower");

    if (!dragAreaInit) {
        
        [upper, middle, lower].forEach(dropZone => {
            console.info("Adding drop zone", dropZone.id);
            dropZone.addEventListener("dragover", dragoverHandler);
            dropZone.addEventListener("dragenter", dragenterHandler);
            dropZone.addEventListener("dragleave", dragleaveHandler);
            dropZone.addEventListener("drop", dropHandler);
        });
        dragAreaInit = true;
    }
}

function dragoverHandler(ev) {
    ev.preventDefault();
    
    //overOrder = window.getComputedStyle(ev.target).order;
    //draggingOrder = window.getComputedStyle(draggable).order;

    //console.info(`over: contains droppable = ${ev.target.classList.contains("droppable")}, draggable != target = ${draggable != ev.target}`, ev.target);
    ev.dataTransfer.dropEffect = "move";
}

function dropHandler(ev) {
    //overOrder = window.getComputedStyle(ev.target).order;
    //draggingOrder = window.getComputedStyle(draggable).order;

    //console.info(`drop: ${ev.target.id} overOrder ${overOrder}, draggingOrder ${draggingOrder}`);

    //ev.stopPropagation();
    //ev.stopImmediatePropagation();
    ev.preventDefault();

    if (ev.toElement == upper || ev.toElement == lower || ev.toElement == middle) {
        // Get the id of the target and move the element
        const draggedId = ev.dataTransfer.getData("text/plain");  
        if (draggedId) {
            //draggable.valueCard.priority = ev.toElement.id;
            //ev.target.appendChild(draggable);
            dropCallback(draggedId, ev.toElement.id);
        }
    }
}

function dragenterHandler({ target }) {
    if (target.classList.contains("droppable")) {
        target.classList.add(`dropping`);
    }
}

function dragleaveHandler({ target }) {
    if (target.classList.contains("droppable")) {
        target.classList.remove(`dropping`);
    }
}
