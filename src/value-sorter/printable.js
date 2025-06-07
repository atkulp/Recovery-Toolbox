let values;

fetch('values.json')
    .then(response => response.json())
    .then((data) => {
        values = data;
        displayCards(0, document.querySelector('.main .printable'));
});

function displayCards(visible = 6, destEl) {
    // Get all cards for printing
    console.debug("Displaying cards for printing", values);

    let currentCards = [
        { name: "Personal Values<br/> Card Sort", description: "Miller, de Baca, Matthews, Wilbourne<br/>U of New Mexico, 2001", id: 0 },
        { name: "Important to me", description: "", id: 0 },
        { name: "Very important to me", description: "", id: 0 },
        { name: "Not important to me", description: "", id: 0 },
        ...values.toSorted((a, b) => a.name.localeCompare(b.name)), // Sort by name
        { name: "Other Value:", description: "", id: 0 },
        { name: "Other Value:", description: "", id: 0 },
        { name: "Other Value:", description: "", id: 0 },
    ];
    
    let i = 0;
    for (let v of currentCards) {
        let card = document.createElement("div");
        card.order = v.id;
        card.id = `card-${i++}`;
        card.className = "value-card";
        card.innerHTML = `<div>${v.name}</div><div>${v.description}</div><div>${v.id || ''}</div>`;
        card.valueCard = v;
        v.priority = "middle";

        destEl.appendChild(card);
    }
}