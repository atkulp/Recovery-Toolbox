const { createApp, ref, watch, reactive } = Vue

createApp({
    data() {
        return {
            values: [],
            showSorter: true,
            showSummary: false
        }
    },
    mounted() {
        fetch('values.json')
            .then(response => response.json())
            .then((values) => {
                this.values = values;
                this.initData();
            });
        
        initDropZones();
    },
    computed: {
        highPriValues() {
            return this.values.filter(v => v.priority == "upper");
        },
        midPriValues() {
            return this.values.filter(v => v.priority == "middle");
        },
        lowPriValues() {
            return this.values.filter(v => v.priority == "lower");
        },
        unsortedValues() {
            return this.values.filter(v => !v.priority);
        }
    },
    methods: {
        initData() {
            this.showSorter = false;
            this.showSummary = false;

            // Randomize the values array
            this.values.sort(() => Math.random() - 0.5);

            for (let v of this.values) {
                v.priority = null;
            }

            document.querySelector('.sort-upper').replaceChildren();
            document.querySelector('.sort-middle').replaceChildren();
            document.querySelector('.sort-lower').replaceChildren();
            this.displayCards(6, document.querySelector(".sort-middle"));

            this.showSorter = true;

        },
        resetClicked() {
            this.initData();
        },
        printClicked() {
            window.print();
        },
        nextClicked() {
            // Clear the current sort zones
            document.querySelector('.sort-upper').replaceChildren();
            document.querySelector('.sort-middle').replaceChildren();
            document.querySelector('.sort-lower').replaceChildren();

            this.displayCards(6, document.querySelector(".sort-middle"));
        },
        displayCards(visible = 6, destEl) {
            let currentCards;

            if (!visible || visible < 1) {
                // Get all cards for printing
                currentCards = this.values;
            } else {
                // Only get the first unsorted 'visible' cards for display
                currentCards = this.unsortedValues.slice(0, visible);
            }

            // Out of cards? Switch to summary view
            if (currentCards.length == 0) {
                this.showSorter = false;
                this.showSummary = true;
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

            // Initialize drag and drop
            initDrag(destEl.children, (el) => {
                // No-op
            });

            return true;
        }
    }
}).mount('#app');
