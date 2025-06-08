# Recovery Toolbox
Tools for people in addiction recovery

## What is Recovery Toolbox?
Recovery Toolbox is a foundation for tools to help addicts with their recovery process. Currently consists of a page suitable as a new tab page for tracking sobriety and daily progress, along with a value card sorter tool to assist with finding meaning in your life.

### Journal
<img width="600" alt="Journal" src="assets/journal.png">

### Value Sorter
<img width="600" alt="Journal" src="assets/value-sorter.png">

## Licensing
Recovery Toolbox is distributed under a version of the "MIT License",
which is a BSD-like license. See the 'LICENSE' file for details.

## Environment
Currently all static web pages using HTML application local storage with no backend.

## How to build
For self-hosting or testing, simply install and run `serve` or a similar lightweight web server. There is no server-side component, but the `fetch` operations will fail with file:// (File | Open) hosting.

## How to use
For the sobriety journal, go to [atkulp.github.io/Recovery-Toolbox/journal](https://atkulp.github.io/Recovery-Toolbox/journal). Enter notes on how you worked your recovery, ways you engaged in self-care, risks to your sobriety, and things you're grateful for. Entries automatically save for the given day and will display until the next day.

For the value card sorter tool, go to [atkulp.github.io/Recovery-Toolbox/value-sorter](https://atkulp.github.io/Recovery-Toolbox/value-sorter). Drag and drop values to Very or Less Important to me, then click Next. After sorting all cards, the More Important cards will be displayed. As this is still in-progress, there is nothing else to see for now.

There are also pages related to the Value Card Sorter. For instructions and more information about the original tool, see the [src/value-sorter/help.html](src/value-sorter/help.html) page. For a printable version of the cards with 10/page and 12/page options (assuming 8.5x11 paper), see the [src/value-sorter/printable.html](src/value-sorter/printable.html) page.

## Todo
So much to do! I envision the journal being used as a new tab page and maybe creating an extension would make this easy. Overally, the code is extremely rough and mostly proof of concept. Sorry!

### General
- Major code cleanup!

### Journal (src/journal)

- Rotate backgrounds (unsplash? something else simple?)
- Add user-specified affirmations
- Add entry for sobriety date (app storage, key=sobrietyDate, value = YYYY-MM-DD)
- Add navigation for previous journal entries (app storage, key=journal)
- Add details on 12-step group/meeting
- Add Youtube video links based on specific addiction(s)
- Add graph of journal entries over time
- Call out sobriety "streaks"

### Value Sorter (src/value-sorter)

- Better presentation (much in progress)
- Once all sorted, encourage user to narrow down to ten
- Once ten in More Important, maybe allow for granular ordering
- Maybe use these highest rated values in journal (cycle under days of sobriety?)
- Store sort choices in app storage to recall later
- Cleaner drag and drop handling, list binding