import OpenSeadragon from 'openseadragon';

// Initialize OpenSeadragon Viewer
const viewer = OpenSeadragon({
    id: "wsi-viewer",
    prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
    tileSources: {
        type: "image",
        url: "assets/images/7_20241209_024613.png"
    },
    showNavigationControl: true,
    defaultZoomLevel: 1,
    visibilityRatio: 1,
    maxZoomPixelRatio: 10,
    zoomPerScroll: 1.2, // Enable zooming with mouse scroll
    mouseNavEnabled: true, // Enable mouse-based navigation
    gestureSettingsMouse: {
        clickToZoom: true,
        dblClickToZoom: true,
        flickEnabled: true,
        pinchToZoom: true,
        scrollToZoom: true
    }
});
viewer.setMouseNavEnabled(true);


// Load detection results from output.json
fetch('assets/data/output.json')
    .then(response => response.json())
    .then(data => {
        const detectionResults = JSON.parse(data.inference_results).output.detection_results;
        const overlay = document.getElementById('overlay');

        detectionResults.forEach(([x, y, x2, y2, label]) => {
            const width = x2 - x;
            const height = y2 - y;
            const box = document.createElement('div');
            box.style.position = 'absolute';
            box.style.border = '2px solid red';
            box.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            box.title = `${label} (Count: 222, %: 67%)`;

            overlay.appendChild(box);

            // Update box position and size with zoom
            viewer.addHandler('update-viewport', () => {
                const zoom = viewer.viewport.getZoom();
                const containerPoint = viewer.viewport.imageToViewportCoordinates(x, y);
                box.style.left = `${containerPoint.x * viewer.container.clientWidth}px`;
                box.style.top = `${containerPoint.y * viewer.container.clientHeight}px`;
                box.style.width = `${width * zoom}px`;
                box.style.height = `${height * zoom}px`;
            });
        });
    })
    .catch(error => console.error('Error loading detection results:', error));

// 🌟 Handle Zoom on Mouse Move
document.getElementById('wsi-viewer').addEventListener('mousemove', (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    // Adjust zoom level and center viewport to cursor
    const point = viewer.viewport.imageToViewportCoordinates(x * 1024, y * 512);
    viewer.viewport.panTo(point); 
    viewer.viewport.zoomTo(viewer.viewport.getZoom() * 1.02); // Adjust zoom intensity
});

// ✅ Sync hub view pointer with WSI viewer
const hubPointer = document.getElementById('hub-pointer');
viewer.addHandler('update-viewport', () => {
    const bounds = viewer.viewport.getBounds();
    const imageBounds = viewer.viewport.viewportToImageRectangle(bounds);
    const hubImage = document.getElementById('hub-image');
    const scaleX = hubImage.clientWidth / 1024;
    const scaleY = hubImage.clientHeight / 512;
    
    hubPointer.style.left = `${imageBounds.x * scaleX}px`;
    hubPointer.style.top = `${imageBounds.y * scaleY}px`;
    hubPointer.style.width = `${imageBounds.width * scaleX}px`;
    hubPointer.style.height = `${imageBounds.height * scaleY}px`;
});

// ✅ Navigate WSI viewer by clicking on hub view
document.getElementById('hub-image').addEventListener('click', (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const point = new OpenSeadragon.Point(x * 1024, y * 512);
    viewer.viewport.panTo(viewer.viewport.imageToViewportCoordinates(point.x, point.y));
    viewer.viewport.zoomTo(viewer.viewport.getZoom());
});
