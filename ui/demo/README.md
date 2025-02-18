# How to get this demo to work

To get this to work, I had to do something along the lines of...

1. `cd ../library/` (go into the folder containing the pdf-component-library library)
2. `yarn install`   (install its dependencies)
3. `yarn build`     (build the library)
4. `cd ../demo/`    (come back into this directory)
5. `yarn install`   (install the dependencies for the demo)
6. `yarn start`     (run the demo)

To see if things are working...

* Go to `localhost:3000` in the browser
* Scroll to the start of Section 5 in the loaded paper, text `Patients commented on aspects...`
* Click the `Highlight Overlay` button. It should highlight that text and low light the rest of the document.
* Click the `Highlight Text` button. It should add blue underlines to the text.

# To embed this Reader app elsewhere...

Build the app by running `yarn build`.
Then, check out the generated `build/` directory.
Check out the `index.html` file—it shows an example of how you can import the
generated `bundle.js` file to create a ReaderApp component in any container
within an existing web page.

# To support other papers...

This app expects there to be two files for every paper you want to show:

* A PDF
* A JSON containing bounding boxes of sentences to highlight.

It expects these two files to be hosted on your local server.  You can generate
the JSON of bounding boxes following the instructions in
`../pdf-box-extraction`.  Then, put the PDF and JSON on your server in a place
that can be accessed with the `/public/` URL path prefix. Say you want to refer
to the paper with the paper ID `explainable-notes` when you initialize the
component. Then you would make sure that your server can serve up two
files---`/public/explainable-notes.pdf` and
`public/explainable-notes-boxes.json`.

# Some notes on developing this demo PDF reader app.

I started at the code that was originally in the demo directory for the pdf-component-library.
Then I removed a bunch of stuff that seemed unnecessary. Some of my changes were inspired
by guidance from Tal's tutorial on UI development with the component library. Read it at
https://openreader.semanticscholar.org/PaperPlain.
