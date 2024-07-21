import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
    const [layout, setLayout] = useState('');
    const [selectedCameras, setSelectedCameras] = useState([]);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    const cameraOptions = Array.from({ length: 20 }, (_, i) => `Camera ${i + 1}`);

    useEffect(() => {
        if (layout) {
            alert(`You can choose at most ${getMaxSelections()} camera(s) for the ${layout} layout.`);
        }
    }, [layout]);

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

    const handleSend = async () => {

        console.log('Sending data...'); // Add this line for debugging
        const layoutNumber = layout === '1x1' ? 1 : layout === '2x2' ? 4 : 16;
        const data = [layoutNumber, ...selectedCameras].join(',') + '\n'; // Append newline character

        try {
            const response = await fetch('http://192.168.1.100:61000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: data,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setButtonsDisabled(false);
            console.log('Data sent, button enabled'); // Add this line for debugging
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
