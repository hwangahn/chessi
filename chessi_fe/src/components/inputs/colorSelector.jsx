import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColorSelector({ color, leftAlign, onChange }) {
  const [_color, setColor] = useState(color);
  const [showPicker, setShowPicker] = useState(false);

  // keep local state in sync with parent prop
  useEffect(() => {
    setColor(color);
  }, [color]);

  const handleChange = (newColor) => {
    setColor(newColor);

    if (onChange) {
      onChange(newColor);
    }
  };

  return (
    <div className="relative cursor-pointer">
      <div
        className="flex items-center justify-center border border-gray-600 rounded-lg p-2 bg-[#1f1f1f] w-fit h-[100%]"
        onClick={() => setShowPicker(!showPicker)}
      >
        {/* Color preview circle */}
        <div
          className="w-6 h-6 rounded-full border border-gray-400"
          style={{ backgroundColor: _color }}
        ></div>
      
      </div>
      
      {/* Color Picker Popup */}
      {showPicker && (
        <div className={`absolute ${leftAlign ? "left-0" : "right-0"} top-full mt-2 bg-[#1f1f1f] p-3 rounded-lg shadow-lg border border-gray-700 z-[999]`}>
          <HexColorPicker color={_color} onChange={handleChange} />
          <button
            className="mt-2 w-full px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => setShowPicker(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
