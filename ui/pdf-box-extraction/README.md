# Set up

Install Anaconda from here https://www.anaconda.com/download.
Don't forget to successfully run `conda init` if you are getting Anaconda for the first time.

```
conda create -n papermage python=3.11
conda activate papermage
```

(These instructions for Anaconda setup are based on those from the PaperMage
repository at: https://github.com/allenai/papermage)

Then, install these other dependencies:

```
conda install poppler  # necessary for Mac, I think
pip install 'papermage[dev,predictors,visualizers]'
```

## Running the script

The purpose of this repository is to extract bounding boxes for passages that
you have the text for. We assume you have already put a list of the passages
that you care about into a file called `...-search-strings.json`, with format:

```json
[
  "This is the first passage.",
  "This is the second passage. (Passages can have multiple sentences)."
]
```

You should also already have downloaded a local version of the PDF that contains
these passages.

To extract the bounding boxes, run

```sh
python extract.py
  --input-pdf explainable-notes.pdf
  --search-strings explainable-notes-search-strings.json
  --output-path explainable-notes-boxes.json
```

Where `--input-pdf` points to the PDF file, and `--search-strings` points to the
JSON file described above with a list of passages you want to find the bounding
box for. `--output-path` should be the name of a file you want to create which
will include JSON of extracted bounding boxes for found text.

## Running from VSCode

In VSCode, you can set the Python Interpreter to the new Python interpreter
installed in your Anaconda environment by doing "Select Interpreter" in the
Command Palette and then looking for the Python in a place like
"/Users/[username]/anaconda3/envs/papermage/bin/python".

# Credits

Inspiration for how to process the sentences and bounding boxes came from this
tutorial for the Semantic Reader platform: https://openreader.semanticscholar.org/LLMQA.
