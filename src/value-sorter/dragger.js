let dragAreaInit = false;
let dropCallback;

function initDrag(items, callback) {
    let order = 0;
    for (let c of items) {
        c.style.order = order++;
        c.setAttribute("draggable", "true");
        c.addEventListener("dragstart", dragstartHandler);
        //c.addEventListener("dragenter", dragenterHandler);
        //c.addEventListener("dragover", dragoverHandler);
        //c.addEventListener("dragleave", dragleaveHandler);
        //c.addEventListener("dragend", dragendHandler);
    }
    dropCallback = callback;
}

function removeDrag(items) {
    for (let c of items) {
        c.removeEventListener("dragstart", dragstartHandler);
        //c.removeEventListener("dragenter", dragenterHandler);
        //c.removeEventListener("dragover", dragoverHandler);
        //c.removeEventListener("dragleave", dragleaveHandler);
        //c.removeEventListener("dragend", dragendHandler);
    }
    dragendHandler();
}

// Drag/drop
let draggable, droppable;

const upper = document.getElementById("upper");
const middle = document.getElementById("middle");
const lower = document.getElementById("lower");

if (!dragAreaInit) {
    [upper, middle, lower].forEach(d => {
        d.addEventListener("drop", dropHandler);
        d.addEventListener("dragstart", dragstartHandler);
        d.addEventListener("dragenter", dragenterHandler);
        d.addEventListener("dragover", dragoverHandler);
        d.addEventListener("dragleave", dragleaveHandler);
        d.addEventListener("dragend", dragendHandler);
    });
    dragAreaInit = true;
}

function dragstartHandler({ target, dataTransfer }) {
    console.info("dragstart", target);
    dataTransfer.setData("text/plain", target.id);
    dataTransfer.effectAllowed = "move";
    draggable = target;
    window.getComputedStyle(e.target).order;
}

function dragoverHandler(ev) {
    ev.preventDefault();
    
    //overOrder = window.getComputedStyle(ev.target).order;
    //draggingOrder = window.getComputedStyle(draggable).order;

    console.info(`over: contains droppable = ${ev.target.classList.contains("droppable")}, draggable != target = ${draggable != ev.target}`, ev.target);

    if (ev.target.classList.contains("droppable") && draggable != ev.target) {
        console.info("valid drop target");
        ev.dataTransfer.dropEffect = "move";
        droppable = ev.currentTarget;
    }
    else {
        console.info("bad  drop target");
        ev.dataTransfer.dropEffect = "none";
        droppable = null;
    }
}

function dropHandler(ev) {
    overOrder = window.getComputedStyle(ev.target).order;
    draggingOrder = window.getComputedStyle(draggable).order;

    console.info(`drop: ${ev.target.id} overOrder ${overOrder}, draggingOrder ${draggingOrder}`);

    ev.stopPropagation();
    ev.stopImmediatePropagation();
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
    console.info("dragenter", target);
    if (draggable && target.classList.contains("droppable")) {
        target.classList.add(`dropping`);
    }
}

function dragleaveHandler({ target }) {
    console.info("dragleave", target);
    if (draggable) {
        target.classList.remove(`dropping`);
    }
}

function dragendHandler() {
    console.info("dragend");
    draggable = null;
    Array.from(document.querySelectorAll('.dropping'))
        .forEach((pri) => pri.classList.remove(`dropping`));

}
