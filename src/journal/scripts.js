const { createApp, ref, watch, reactive } = Vue

createApp({
    data() {
        return {
            sobrietyCounter: 0,
            qotd: {
                text: null,
                author: null
            },
            affirmation: "Loading...",
            "date": null,
            "time": null,
            entry: {
                'date': null,
                'sobriety': null,
                'selfcare': null,
                'risks': null,
                'gratitude': null
            },
            journal: []
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            // Load a random quote
            fetch('quotes.json')
                .then(response => response.json())
                .then(quotes => {
                    let quoteIdx = Math.ceil(Math.random() * quotes.length) - 1;
                    let qotd = document.querySelector('.qotd');
                    this.qotd = quotes[quoteIdx];
                });

            // Load a random affirmation
            fetch('affirmations.json')
                .then(response => response.json())
                .then(affirmations => {
                    let affirmationIdx = Math.ceil(Math.random() * affirmations.length) - 1;
                    this.affirmation = affirmations[affirmationIdx];
                });

            // Set the date/time display (current time zone)
            let now = new Date();
            let locale = Intl.DateTimeFormat().resolvedOptions().locale;
            let datetimeParts = Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(now).split(' at ');
            this.date = datetimeParts[0];
            this.time = datetimeParts[1];

            // Sobriety
            let sobrietyDateVal = window.localStorage.getItem("sobrietyDate");
            let sobrietyDate = sobrietyDateVal ? new Date(sobrietyDateVal) : new Date();
            let elapsed = (now.getTime() - sobrietyDate.getTime()) / 1000 / 60 / 60 / 24;
            this.sobrietyCounter = `${Math.round(elapsed)} days of sobriety`;

            this.loadJournal();
        },
        loadJournal() {
            // Load or create the journal for today
            let now = new Date();
            let today = now.toJSON().split('T')[0];

            this.journal = JSON.parse(window.localStorage.getItem('journal')) ?? [];
            let todayEntry = this.journal.find(e => e.date == today);

            if (todayEntry == null) {
                this.entry.date = today;
                this.journal.push(this.entry);
            } else {
                this.entry = reactive(todayEntry)
            }
        }
    },
    watch: {
        entry: {
            handler(newVal) {
                // Respond to changes here, e.g., save to localStorage
                window.localStorage.setItem('journal', JSON.stringify(this.journal));
            },
            deep: true
        }
    },
}).mount("#app");
