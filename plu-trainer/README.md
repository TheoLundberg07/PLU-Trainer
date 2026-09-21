# PLU Trainer

A small static site to drill PLU (produce lookup) codes: you're shown a
photo of a produce item and have to type its code from memory.

## How it works

- **Drill mode** (`index.html`) — shows a random item's image, you type
  the code and press **Enter**. Correct answers flash green and
  auto-advance. Wrong answers flash red and clear the input so you can
  retry. Press **Pass** to reveal the code and skip to the next item.
- **Overview** (`overview.html`) — browse every item with its image,
  code and name, with a filter box.

## Adding items

Everything is driven by `data/plu.json`, a flat array:

```json
[
  { "code": "4011", "name": "Banana", "image": "banana.jpg" }
]
```

1. Drop the item's photo into `images/`, named to match the `image`
   field.
2. Add an entry to `data/plu.json` with the matching `code`, `name`
   and `image` filename.

That's it — both the drill and the overview page read straight from
this file, so there's nothing else to update.

## Deploying to GitHub Pages

1. Push this folder as a repo (or a subfolder) to GitHub.
2. In the repo's **Settings → Pages**, set the source to the branch
   (and folder, if applicable) containing these files.
3. GitHub will give you a URL like
   `https://<username>.github.io/<repo>/` once it builds.

No build step, no dependencies — it's plain HTML/CSS/JS.
