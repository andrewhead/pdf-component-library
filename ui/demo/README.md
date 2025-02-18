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

# Some notes on developing this demo PDF reader app.

I started at the code that was originally in the demo directory for the pdf-component-library.
Then I removed a bunch of stuff that seemed unnecessary. Some of my changes were inspired
by guidance from Tal's tutorial on UI development with the component library. Read it at
https://openreader.semanticscholar.org/PaperPlain.