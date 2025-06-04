function displayCards(visible = 6, destEl) {
    let currentCards = values
    if (!visible || visible < 1) {
        // Get all cards for printing
        currentCards = [
            { name: "Personal Values<br/> Card Sort", description: "Miller, de Baca, Matthews, Wilbourne<br/>U of New Mexico, 2001", id: 0 },
            { name: "Important to me", description: "", id: 0 },
            { name: "Very important to me", description: "", id: 0 },
            { name: "Not important to me", description: "", id: 0 },
            ...values.toSorted((a, b) => a.name.localeCompare(b.name)), // Sort by name
            { name: "Other Value:", description: "", id: 0 },
            { name: "Other Value:", description: "", id: 0 },
            { name: "Other Value:", description: "", id: 0 },
        ];
    } else {
        // Only get the first unsorted 'visible' cards for display
        let unsorted = values.filter(v => !v.priority);
        let len = unsorted.length, rnd = Math.ceil(Math.random() * (len - visible));
        currentCards = unsorted.slice(rnd, rnd + visible)
    }
    
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