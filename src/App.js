import React, { useEffect, useState } from 'react';
import './App.css';
import Modal from 'react-modal';

const App = () => {
    const [layout, setLayout] = useState('');
    const [selectedCameras, setSelectedCameras] = useState([]);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const cameraOptions = Array.from({ length: 20 }, (_, i) => `Camera ${i + 1}`);

    useEffect(() => {
        if (layout) {
            setModalIsOpen(true);
        }
    }, [layout]);

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

    const handleSend = async () => {
        setButtonsDisabled(true);

        // Placeholder for sending functionality
        console.log("Sending selected cameras and layout:", { selectedCameras, layout });

        try {
            const response = await fetch(`http://192.168.1.100:61000/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ layout, selectedCameras }),
            });

            const result = await response.json();
            if (result.status === 'ready') {
                setButtonsDisabled(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setButtonsDisabled(false); // Re-enable buttons in case of error
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const getMaxSelections = () => {
        return layout === '1x1' ? 1 : layout === '2x2' ? 4 : 16;
    };

    return (
        <div className="fot-type container">
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
                )}
                {layout && (
                    <div className="button-container">
                        <button className="clear-button" onClick={handleClear} disabled={buttonsDisabled||selectedCameras.length === 0}>Clear</button>
                        <button className="send-button" onClick={handleSend} disabled={buttonsDisabled || selectedCameras.length === 0}>Send</button>
                    </div>
                )}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Layout Selection Info"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Layout Selection</h2>
                <p>You can choose at most {getMaxSelections()} camera(s) for the {layout} layout.</p>
                <button onClick={closeModal}>OK</button>
            </Modal>
        </div>
    );
};

export default App;
