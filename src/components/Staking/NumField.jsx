import React from "react";

const NumField = ({ label, value, onChange, placeholder, max, min = 0, ...props }) => {
    const handleChange = (e) => {
        const newValue = e.target.value;
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleMaxClick = () => {
        if (max && onChange) {
            onChange(max.toString());
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium dark:text-white text-title-light">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...props}
                />

                {max && (
                    <button
                        type="button"
                        onClick={handleMaxClick}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                        MAX
                    </button>
                )}
            </div>
        </div>
    );
};

export default NumField;
