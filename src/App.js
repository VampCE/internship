import React, { useState } from 'react';
import './App.css';

const App = () => {
    const [layout, setLayout] = useState('1x1');
    const [selectedCameras, setSelectedCameras] = useState([]);

    const cameraOptions = Array.from({ length: 20 }, (_, i) => `Camera ${i + 1}`);

    const handleLayoutChange = (event) => {
        const selectedLayout = event.target.value;
        setLayout(selectedLayout);
        setSelectedCameras([]); // Reset selected cameras on layout change
    };
    const handleCameraClick = (camera) => {
        const maxSelections = layout === '1x1' ? 1 : layout === '2x2' ? 4 : 16;
        const isSelected = selectedCameras.includes(camera);

        if (isSelected) {
            setSelectedCameras(selectedCameras.filter(c => c !== camera));
        } else if (selectedCameras.length < maxSelections) {
            setSelectedCameras([...selectedCameras, camera]);
        }
    };
    const handleClear = () => {
        setSelectedCameras([]);
    };

    const handleSend = () => {
        // Placeholder for sending functionality
        console.log("Sending selected cameras:", selectedCameras);
    };


    return (
        < div className="fot-type container">
            <div className="title-container">
                <h1>Camera Layout</h1>
            </div>
            <div>
                <div className="layout-container">
                    <h1>Choose Layout Type</h1>
                    <div className="center-middle">
                        <label className="radio-label">
                            <input
                                type="radio"
                                value="1x1"
                                checked={layout === '1x1'}
                                onChange={handleLayoutChange}
                                className="radio-input"
                            />
                            1x1
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                value="2x2"
                                checked={layout === '2x2'}
                                onChange={handleLayoutChange}
                                className="radio-input"
                            />
                            2x2
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                value="4x4"
                                checked={layout === '4x4'}
                                onChange={handleLayoutChange}
                                className="radio-input"
                            />
                            4x4
                        </label>
                    </div>
                </div>
                <div className="camera-options-container">
                    <h1 className="layout-container">Camera Options</h1>
                    <div className="camera-options">
                        {cameraOptions.map((camera, index) => (
                            <div
                                key={index}
                                className={`camera-option ${selectedCameras.includes(camera) ? 'selected' : ''}`}
                                onClick={() => handleCameraClick(camera)}
                            >
                                {camera}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="button-container">
                    <button className="clear-button" onClick={handleClear}>Clear</button>
                    <button className="send-button" onClick={handleSend} disabled={selectedCameras.length === 0}>Send</button>

                </div>
            </div>
        </div>
    );
};

export default App;
