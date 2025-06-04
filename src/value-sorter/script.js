const valueRatings = {
    upper: [],
    middle: [],
    lower: [],
    unsorted: []
};

// Display values
let sortUpper = document.querySelector('.sort-upper');
let sortMiddle = document.querySelector('.sort-middle');
let sortLower = document.querySelector('.sort-lower');

let nextButton = document.getElementById('nextButton');
nextButton.addEventListener("click", () => {
    sortUpper.replaceChildren();
    sortMiddle.replaceChildren();
    sortLower.replaceChildren();

    if (!displayCards(6, sortMiddle))
    {
        displayCards(0, document.querySelector(".summary-cards"), valueRatings.upper);
    }

});

window.addEventListener("DOMContentLoaded", () => {
    displayCards(6, sortMiddle);
});

function countCards() {
    valueRatings.upper = values.filter(v => v.priority == "upper");
    valueRatings.middle = values.filter(v => v.priority == "middle");
    valueRatings.lower = values.filter(v => v.priority == "lower");
    valueRatings.unsorted = values.filter(v => !v.priority);

    document.getElementById("remaining").innerHTML = `${valueRatings.unsorted.length} cards remaining to sort`;

    document.querySelector(".upper .zone-label").innerHTML = `Very important to me (${valueRatings.upper.length})`;
    document.querySelector(".middle .zone-label").innerHTML = `Important to me (${valueRatings.middle.length})`;
    document.querySelector(".lower .zone-label").innerHTML = `Not important to me (${valueRatings.lower.length})`;
}

function displayCards(visible = 6, destEl, cards) {
    let currentCards = cards ?? values;

    if (!visible || visible < 1) {
        // Get all cards for printing
    } else {
        // Only get the first unsorted 'visible' cards for display
        let unsorted = currentCards.filter(v => !v.priority);
        let len = unsorted.length, rnd = Math.ceil(Math.random() * (len - visible));
        currentCards = unsorted.slice(rnd, rnd + visible)
    }

    if (currentCards.length == 0) {
        document.querySelector(".sorter").classList.add("hidden");
        return false;
    }

    let i = 0;
    for (let v of currentCards) {
        let card = document.createElement("div");
        card.order = v.id;
        card.id = `card-${i++}`;
        card.className = "value-card draggable";
        card.innerHTML = `<div>${v.name}</div><div>${v.description}</div>`;
        card.valueCard = v;
        v.priority = "middle";

        destEl.appendChild(card);
    }

    initDrag(sortMiddle.children, (el) => {
        countCards();
    });

    countCards();

    return true;
}