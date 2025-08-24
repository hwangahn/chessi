import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

export default function EmojiSelector({ emoji, leftAlign, onChange }) {
  const [_emoji, setEmoji] = useState(emoji || "😀");
  const [showPicker, setShowPicker] = useState(false);

  const handleClick = (emojiData) => {
    setShowPicker(false);
    setEmoji(emojiData.emoji);

    if (onChange) {
      onChange(emojiData.emoji);
    }
  };

  return (
    <div
      className="relative flex items-center gap-2 cursor-pointer border border-gray-600 rounded-lg p-2 bg-[#1f1f1f]"
      onClick={() => setShowPicker(!showPicker)}
    >
      <span className="w-6 h-6 flex items-center justify-center">{_emoji}</span>

      {/* Emoji Picker Popup */}
      {showPicker && (
        <div className={`absolute ${leftAlign ? "left-0" : "right-0"} top-full mt-2 bg-[#1f1f1f] p-3 rounded-lg shadow-lg border border-gray-700 z-[999]`}>
          <EmojiPicker onEmojiClick={handleClick} theme="dark" />
        </div>
      )}
    </div>
  );
}
