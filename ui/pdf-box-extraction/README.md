Install Anaconda from here https://www.anaconda.com/download.
Don't forget to successfully run `conda init` if you are getting Anaconda for the first time.

```
conda create -n papermage python=3.11
conda activate papermage
```

(These instructions are from here: https://github.com/allenai/papermage)

In VSCode, you can set the Python Interpreter to the new Python interpreter installed in your Anaconda environment by doing "Select Interpreter" in the Command Palette and then looking for the Python in a place like "/Users/[username]/anaconda3/envs/papermage/bin/python".

Once you have done that, open up a Terminal in VSCode. Then...

```
conda install poppler
pip install 'papermage[dev,predictors,visualizers]'
```