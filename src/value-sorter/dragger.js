let dragAreaInit = false;
let dropCallback;

//////////////////////////////////////////
// Initialize value cards (draggable items)
//////////////////////////////////////////

function initDrag(items, callback) {
    let order = 0;
    for (let dragItem of items) {
        dragItem.addEventListener("dragstart", dragstartHandler);
        //c.addEventListener("drag", dragHandler);
        dragItem.addEventListener("dragend", dragendHandler);
        dragItem.setAttribute("draggable", "true");
        dragItem.style.order = order++;
    }
    dropCallback = callback;
}

function removeDrag(items) {
    for (let c of items) {
        c.removeEventListener("dragstart", dragstartHandler);
    }
    dragendHandler();
}

// On initial grab, preserve its ID
function dragstartHandler({ target, dataTransfer }) {
    dataTransfer.setData("text/plain", target.id);
    dataTransfer.effectAllowed = "move";
    draggable = target;
    //window.getComputedStyle(target).order;
}

function dragendHandler() {
    draggable = null;
    Array.from(document.querySelectorAll('.dropping'))
        .forEach((pri) => pri.classList.remove(`dropping`));
}

//////////////////////////////////////////
// Initialize drop zones (droppable areas)
//////////////////////////////////////////
let draggable, droppable;
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

    //if (ev.target.classList.contains("droppable") && draggable != ev.target) {
    //    console.info("valid drop target");      
        ev.dataTransfer.dropEffect = "move";
        droppable = ev.currentTarget;
    //}
}

function dropHandler(ev) {
    overOrder = window.getComputedStyle(ev.target).order;
    draggingOrder = window.getComputedStyle(draggable).order;

    //console.info(`drop: ${ev.target.id} overOrder ${overOrder}, draggingOrder ${draggingOrder}`);

    //ev.stopPropagation();
    //ev.stopImmediatePropagation();
    ev.preventDefault();

    if (draggable && droppable) {
        if (ev.toElement == upper || ev.toElement == lower || ev.toElement == middle) {
            // Get the id of the target and move the element
            const data = ev.dataTransfer.getData("text/plain");
            if (data) {
                draggable.valueCard.priority = ev.toElement.id;
                ev.target.appendChild(draggable);
                dropCallback(draggable);
            }

            droppable.classList.remove("dropping");
            draggable = null;
            droppable = null;
        }
    }
}

function dragenterHandler({ target }) {
    if (draggable && target.classList.contains("droppable")) {
        target.classList.add(`dropping`);
    }
}

function dragleaveHandler({ target }) {
    if (draggable && target.classList.contains("droppable")) {
        target.classList.remove(`dropping`);
    }
}
