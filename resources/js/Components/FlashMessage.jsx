import { useEffect, useState } from 'react';

export default function FlashMessage({ message }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!show || !message) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
                <span>{message}</span>
                <button
                    onClick={() => setShow(false)}
                    className="ml-4 text-white hover:text-green-100"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
} 