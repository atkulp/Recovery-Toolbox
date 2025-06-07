const { createApp, ref, watch, reactive } = Vue
let locale = Intl.DateTimeFormat().resolvedOptions().locale;

createApp({
    data() {
        return {
            sobrietyCounter: 0,
            qotd: {
                text: null,
                author: null
            },
            affirmation: "Loading...",
            date: null,
            time: null,
            journalDate: ref(new Date()),
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
    computed: {
        // Get the unsorted values (for display)
        unsortedValues() {
            return this.journal.filter(e => e.date != this.today);
        }
    },
    methods: {
        initData() {
            // Load a random quote
            fetch('backgrounds.json')
                .then(response => response.json())
                .then(backgrounds => {
                    let backgroundIdx = Math.ceil(Math.random() * backgrounds.length) - 1;
                    let body = document.querySelector('body');
                    body.style.backgroundImage = `url('${backgrounds[backgroundIdx]}')`;
                });

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
        nextEntry(event) {
            let nowDateStr = new Date().toJSON().split('T')[0];
            let journalDateStr = this.journalDate.toJSON().split('T')[0];

            if (journalDateStr < nowDateStr) {
                this.journalDate.setDate(this.journalDate.getDate() + 1);
                journalDateStr = this.journalDate.toJSON().split('T')[0];

                // Find the previous entry in the journal
                let prevJournal = this.journal.find(e => e.date == journalDateStr);
                if (!prevJournal) {
                    this.entry = { date: journalDateStr, sobriety: '', selfcare: '', risks: '', gratitude: '' };
                    this.journal.push(this.entry);
                } else {
                    this.entry = prevJournal;
                }
            }
        },
        prevEntry(event) {
            this.journalDate.setDate(this.journalDate.getDate() - 1);
            let isoDate = this.journalDate.toJSON().split('T')[0];

            // Find the previous entry in the journal
            let prevJournal = this.journal.find(e => e.date == isoDate);
            if (!prevJournal) {
                this.entry = { date: isoDate, sobriety: '', selfcare: '', risks: '', gratitude: '' };
                this.journal.push(this.entry);
            } else {
                this.entry = prevJournal;
            }
        },
        dateFormat(value, format = 'short') {
            return Intl.DateTimeFormat(locale, { dateStyle: format }).format(value);
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
