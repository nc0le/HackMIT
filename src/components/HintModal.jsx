import React from 'react';

const HintModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
            <div className="rounded-lg max-w-md w-full mx-4" style={{backgroundColor: '#FFFFE7', border: '2px solid #000000'}}>
                <div className="flex items-center justify-between p-4 border-b" style={{borderColor: '#000000'}}>
                    <h3 className="text-lg font-semibold text-black"> ★ Hint</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-600 rounded-full p-1"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                        Try using a for loop to iterate from 1 to 100. Use the modulo operator (%) to check if a number is divisible by 3 or 5. Remember to check for multiples of both 3 and 5 first!
                    </p>
                </div>
                <div className="flex justify-end p-4" style={{borderColor: '#000000'}}>
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white rounded-md"
                        style={{backgroundColor: '#E89228'}}
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HintModal;
