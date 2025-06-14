const { createApp, ref, watch, reactive } = Vue
let locale = Intl.DateTimeFormat().resolvedOptions().locale;

createApp({
    data() {
        return {
            qotd: {
                text: null,
                author: null
            },
            affirmation: "Loading...",
            date: null,
            time: null,
            journalDate: new Date(),
            entry: {
                'date': null,
                'sobriety': null,
                'selfcare': null,
                'risks': null,
                'gratitude': null
            },
            settings: {
                sobrietyDate: null,
                showQuotes: true,
                showAffirmations: true,
                name: null,
                prefersDark: null,
            },
            journal: [],
            showDialog: false,
            showSettings: false
        };
    },
    mounted() {
        this.initData();

        // Check localStorage for dark mode preference
        // If not set, default to system preference
        let _settings = JSON.parse(window.localStorage.getItem("settings") ?? "{}");

        if (_settings?.sobrietyDate) _settings.sobrietyDate = new Date(_settings.sobrietyDate);

        let lsPrefersDark = _settings.prefersDark;
        if (lsPrefersDark !== null) {
            _settings.prefersDark = lsPrefersDark == "true" || lsPrefersDark === true;
        } else {
            _settings.prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        }

        this.settings = _settings;
    },
    computed: {
        // Get the unsorted values (for display)
        unsortedValues() {
            return this.journal.filter(e => e.date != this.today);
        },
        sobrietyCounter() {
            // Calculate the number of days sober
            if (this.settings.sobrietyDate) {
                let now = new Date();
                // Reset time to midnight for accurate day count
                now.setUTCHours(0, 0, 0, 0);
                let diffTime = Math.abs(now - this.settings.sobrietyDate);
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            return 0;
        },
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
            this.sobrietyDate = sobrietyDateVal ? new Date(sobrietyDateVal) : null;

            this.loadJournal();
        },
        showSettingsDialog() {
            // Show the dialog to update sobriety date
            this.showSettings = true;
        },
        nextEntry(event) {
            let nowDateStr = toISODate(new Date());
            let journalDateStr = toISODate(this.journalDate);

            if (journalDateStr < nowDateStr) {
                // Move to the next day in the journal
                this.journalDate.setDate(this.journalDate.getDate() + 1);
                journalDateStr = toISODate(this.journalDate);

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
            let isoDate = this.toISODate(this.journalDate);

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
            return value ? Intl.DateTimeFormat(locale, { dateStyle: format }).format(value) : '';
        },
        toISODate(value) {
            return value && typeof value !== 'string' ? value.toISOString().split('T')[0] : null;
        },
        toDate(value) {
            return value ? new Date(value) : null;
        },
        loadJournal() {
            // Load or create the journal for today
            let today = this.toISODate(new Date().toJSON());

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
        },
        settings: {
            handler(newVal) {
                if (typeof newVal.sobrietyDate === 'string') {
                    // Convert string date to Date object
                    this.settings.sobrietyDate = new Date(newVal.sobrietyDate);
                }

                // Respond to changes here, e.g., save to localStorage
                const settingsToSave = { ...this.settings };
                // Convert Date object to ISO string for storage
                if (settingsToSave.sobrietyDate && settingsToSave.sobrietyDate instanceof Date) {
                    settingsToSave.sobrietyDate = this.toISODate(settingsToSave.sobrietyDate);
                }
                window.localStorage.setItem('settings', JSON.stringify(settingsToSave));
            },
            deep: true
        },
    },
}).mount("#app");
