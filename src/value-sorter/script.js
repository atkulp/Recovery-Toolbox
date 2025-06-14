const { createApp, ref, watch, reactive} = Vue


createApp({
    data() {
        return {
            values: [],
            showSorter: true,
            showSummary: false,
            page: [],
            prefersDark: null
        }
    },
    mounted() {

        // Check localStorage for dark mode preference
        // If not set, default to system preference
        let lsPrefersDark = window.localStorage.getItem("prefers-dark");
        if (lsPrefersDark !== null) {
            this.prefersDark = lsPrefersDark == "true" || lsPrefersDark === true;
        } else {
            this.prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        }

        // Read value cards from JSON file
        fetch('values.json')
            .then(response => response.json())
            .then((values) => {
                this.values = values;
                this.initData();
            });
        
        // Initialize drag and drop functionality
        setDropCallback((dragId, dropId) => {
            // Update the priority of the dragged item based on the drop target
            let item = this.values.find(item => item.id == dragId);
            if (item) {
                item.priority = dropId;
            }
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
        pageUpper() {
            return this.page.filter(v => v.priority == "upper");
        },
        pageMiddle() {
            return this.page.filter(v => v.priority == "middle");
        },
        pageLower() {
            return this.page.filter(v => v.priority == "lower");
        },
        unsortedValues() {
            return this.values.filter(v => !v.priority);
        }
    },
    watch: {
        prefersDark(newValue) {
            window.localStorage.setItem("prefers-dark", newValue);
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

            this.displayCards(6);

            this.showSorter = true;

        },
        resetClicked() {
            this.initData();
        },
        printClicked() {
            window.print();
        },
        nextClicked() {
            this.displayCards(6, document.querySelector(".sort-middle"));
        },
        dragstart({ target, dataTransfer }) {
            dataTransfer.setData("text/plain", target.id);
            dataTransfer.effectAllowed = "move";
            //window.getComputedStyle(target).order;
        },
        displayCards(visible = 6) {
            // Only get the first unsorted 'visible' cards for display
            this.page = [...this.unsortedValues.slice(0, visible)];
            this.page.forEach(v => { v.priority = "middle"; });

            // Out of cards? Switch to summary view
            if (this.page.length == 0) {
                this.showSorter = false;
                this.showSummary = true;
                return false;
            }

            return true;
        }
    }
}).mount('#app');
