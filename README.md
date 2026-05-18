# Impromptu

Simple HTML, CSS, and JavaScript practice app for impromptu public speaking.

## How it works

- Loads questions from `questions.csv`
- Picks a random question without repeating until the set is exhausted
- Lets you copy the current question to the clipboard

## Run locally

Because the app fetches the CSV, open it through a local server instead of `file://`.

Example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.