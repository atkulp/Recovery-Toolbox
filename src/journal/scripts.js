// Load a random quote
let quoteIdx = Math.ceil( Math.random() * quotes.length) - 1;
let qotd = document.querySelector('.qotd').innerHTML = `&#8220;${quotes[quoteIdx].text}&#8221; &ndash;&nbsp;${quotes[quoteIdx].author ?? 'Anonymous'}`;

// Load a random affirmation
let affirmationIdx = Math.ceil(Math.random() * affirmations.length) - 1;
let affirmation = document.querySelector('.affirmation').innerHTML = affirmations[affirmationIdx];

// Load or create the journal for today
let now = new Date();
let today = now.toJSON().split('T')[0];
let journal = JSON.parse(window.localStorage.getItem('journal')) ?? [];
let entry = journal.find(e => e.date == today)

let fields = document.querySelectorAll('.journal-form input');
let fieldMap = {};
Array.from(fields).forEach(f => fieldMap[f.name] =  f);

if( entry == null ) {
    entry = {
        'date': today,
        'sobriety': null,
        'selfcare': null,
        'risks': null,
        'gratitude': []
    };
    journal.push(entry);
} else {
    fieldMap['sobriety'].value = entry.sobriety ?? '';
    fieldMap['selfcare'].value = entry.selfcare ?? '';
    fieldMap['risks'].value = entry.risks ?? '';
    fieldMap['gratitude'].value = entry.gratitude ?? '';
}

// Set event handler for journal blur
for( let field of fields ) {
    field.onblur = (f) => {
        entry[f.target.name] = f.target.value;
        window.localStorage.setItem('journal', JSON.stringify(journal));
    };
}

// Set the date/time display (current time zone)
let datetime = document.querySelector('.datetime');

let locale = Intl.DateTimeFormat().resolvedOptions().locale;
let datetimeParts = Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, { dateStyle: 'full', timeStyle: 'short' }).format(now).split(' at ');
datetime.innerHTML = `${datetimeParts[0]}<br />${datetimeParts[1]}`;

// Sobriety
let sobriety = document.querySelector('.sobriety');
let sobrietyDateVal = window.localStorage.getItem("sobrietyDate");
let sobrietyDate = sobrietyDateVal ? new Date(sobrietyDateVal) : new Date();
let elapsed = (now.getTime() - sobrietyDate.getTime()) / 1000 / 60 / 60 / 24;
sobriety.innerHTML = `${Math.round(elapsed)} days of sobriety`;