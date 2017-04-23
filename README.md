# Seg-MENTAT-ion Explorer

Mentat is an tool (built in [Electron](https://electron.atom.io/)) to construct segmentation and image processing pipelines using [scikit-image](http://scikit-image.org/).

## Requirements & Dependencies

* python >= 2.7 (must be in PATH)
* scikit-image >= 0.12 (must be in PATH)
* chrome-capable OS for Electron

## Getting Started
### 1. Install python2.7
Both the generic and Anaconda installations work.
([Python](https://www.python.org/downloads/))


### 2. Check out this repository
```
git clone https://github.com/Saganaut/segmentation_explorer.git
```
### 3. Install scikit-image
Scikit-image requires a number of other python packages to run ([scikit-image Requirements](http://scikit-image.org/docs/dev/install.html)). The following commands will prompt you to download the prerequisites .

#### a. Windows & OSX
With Pip:
```bash
pip install scikit-image
```
With Anaconda:
```bash
conda install scikit-image
```
#### b. Debian & Ubuntu
```bash
sudo apt-get install python-skimage
```


### 4. Install/Run Electron App
**Standalone app coming soon!**

For now you will need electron to run the app.
Follow this guide to [Install Electron](https://electron.atom.io/)





### Architecture Overview
Mentat uses Node.js subprocesses to create and run python scripts which create, apply, and export the user-drawn imaging pipelines.



### License
The MIT License (MIT)

Copyright (C) 2016-2017 Robert Pienta

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
