# Artigence-Healthcare-Systems-Private-Limited
Assessment of Artigence Healthcare Systems Private Limited



# WSI Viewer

A web-based Whole Slide Image (WSI) viewer built based on a wireframe, displaying a blood smear image with detection results.

## Directory Structure
- `assets/`: Contains images and data files.
  - `images/`: Blood smear image.
  - `data/`: JSON file with detection results.
- `src/`: Source code.
  - `css/`: Stylesheets.
  - `js/`: JavaScript files.
  - `index.html`: Main HTML file.

## Setup
1. Place `7_20241209_024613.png` in `assets/images/`.
2. Place `output.json` in `assets/data/`.
3. Serve the project using a local server (e.g., `npx http-server`).
4. Open `index.html` in a browser.

## Features
- Zoomable WSI viewer with OpenSeadragon.
- Bounding boxes for detected RBCs from `output.json`.
- Synced hub view with a pointer.
- Responsive layout with findings panel and report button.