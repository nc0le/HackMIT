import React, { useState } from 'react';

const ProgressEditModal = ({ isOpen, onClose, currentTotal, onSave }) => {
    const [newTotal, setNewTotal] = useState(currentTotal);

    if (!isOpen) return null;

    const handleSave = () => {
        const totalValue = parseInt(newTotal);
        if (totalValue > 0) {
            onSave(totalValue);
            onClose();
        }
    };

    const handleCancel = () => {
        setNewTotal(currentTotal);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="rounded-lg max-w-md w-full mx-4" style={{backgroundColor: '#FFFFE7', border: '2px solid #000000'}}>
                <div className="flex items-center justify-between p-4 border-b" style={{borderColor: '#000000'}}>
                    <h3 className="text-lg font-semibold text-black">Edit Progress Goal</h3>
                    <button 
                        onClick={handleCancel}
                        className="text-gray-600 rounded-full p-1"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-4">
                        Set your target number of problems to complete. This will update your progress bar calculation.
                    </p>
                        <input
                            type="number"
                            min="1"
                            value={newTotal}
                            onChange={(e) => setNewTotal(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E89228] focus:border-transparent"
                            style={{backgroundColor: '#F5F5DC'}}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4" style={{borderColor: '#000000'}}>
                    <button 
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white rounded-md"
                        style={{backgroundColor: '#E89228'}}
                    >
                        Save Goal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgressEditModal;
