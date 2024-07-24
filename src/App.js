import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
    const [layout, setLayout] = useState('');
    const [selectedCameras, setSelectedCameras] = useState([]);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [socketReceive, setSocketReceive] = useState(null);
    const [socketReady, setSocketReady] = useState(null);

    const cameraOptions = Array.from({ length: 20 }, (_, i) => `Camera ${i + 1}`);

    useEffect(() => {
        if (layout) {
            alert(`You can choose at most ${getMaxSelections()} camera(s) for the ${layout} layout.`);
        }
    }, [layout]);

    useEffect(() => {
        // Connect to the WebSocket server for receiving data
        const wsReceive = new WebSocket('ws://localhost:61000');
        wsReceive.onopen = () => console.log('WebSocket connection established for receiving data.');
        wsReceive.onmessage = (event) => console.log('Message from server:', event.data);
        wsReceive.onerror = (error) => console.error('WebSocket error:', error);
        setSocketReceive(wsReceive);

        // Connect to the WebSocket server for receiving "ready" message
        const wsReady = new WebSocket('ws://localhost:61001');
        wsReady.onopen = () => console.log('WebSocket connection established for receiving "ready" message.');
        wsReady.onmessage = (event) => {
            if (event.data === 'ready') {
                setButtonsDisabled(false);
            }
        };
        wsReady.onerror = (error) => console.error('WebSocket error:', error);
        setSocketReady(wsReady);

        // Clean up on component unmount
        return () => {
            wsReceive.close();
            wsReady.close();
        };
    }, []);

    const handleLayoutChange = (event) => {
        const selectedLayout = event.target.value;
        setLayout(selectedLayout);
        setSelectedCameras([]); // Reset selected cameras on layout change
    };

    const handleCameraClick = (camera) => {
        const cameraNumber = parseInt(camera.split(' ')[1]);
        const maxSelections = layout === '1x1' ? 1 : layout === '2x2' ? 4 : 16;
        const isSelected = selectedCameras.includes(cameraNumber);

        if (isSelected) {
            setSelectedCameras(selectedCameras.filter(c => c !== cameraNumber));
        } else if (selectedCameras.length < maxSelections) {
            setSelectedCameras([...selectedCameras, cameraNumber]);
        }
    };

    const handleClear = () => {
        setSelectedCameras([]);
    };

    const handleSend = () => {
        setButtonsDisabled(true);
        if (socketReceive) {
            console.log('Sending data...');
            const layoutNumber = layout === '1x1' ? 1 : layout === '2x2' ? 4 : 16;
            const data = [layoutNumber, ...selectedCameras].join(',') ;
            socketReceive.send(data);
            console.log('Data sent successfully!');
            setSelectedCameras([]); // Reset selected cameras after sending data
        }
    };

    const getMaxSelections = () => {
        return layout === '1x1' ? 1 : layout === '2x2' ? 4 : 16;
    };

    return (
        <div className="container">
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
                {layout && (
                    <div className="camera-options-container">
                        <h1>Camera Options</h1>
                        <div className="camera-options">
                            {cameraOptions.map((camera, index) => (
                                <div
                                    key={index}
                                    className={`camera-option ${selectedCameras.includes(index + 1) ? 'selected' : ''}`}
                                    onClick={() => handleCameraClick(camera)}
                                >
                                    {camera}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {layout && (
                    <div className="button-container">
                        <button className="clear-button" onClick={handleClear} disabled={buttonsDisabled || selectedCameras.length === 0}>Clear</button>
                        <button className="send-button" onClick={handleSend} disabled={buttonsDisabled || selectedCameras.length === 0}>Send</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
