import React, { useState, useEffect, useRef } from "react";

const CharacterList = ({ characters, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    // Highlight the first character by default
    if (characters.length > 0) {
      setSelectedIndex(0);
    }
  }, [characters]);

  const handleKeyDown = (e) => {
    if (characters.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % characters.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(
        (prev) => (prev - 1 + characters.length) % characters.length
      );
    } else if (e.key === "Enter") {
      onSelect(characters[selectedIndex]);
    }
  };

  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const handleClick = (character) => {
    onSelect(character);
  };

  useEffect(() => {
    const element = listRef.current;
    if (element) {
      element.focus(); // Ensure the list is focusable for keyboard navigation
    }
  }, []);

  return (
    <div
      tabIndex="0"
      ref={listRef}
      onKeyDown={handleKeyDown}
      style={{ outline: "none" }}
    >
      <ul>
        {characters.map((character, index) => {
          const isSelected = index === selectedIndex;
          const isHovered = index === hoverIndex;
          const isHighlighted = isHovered; // Only highlight the hovered item

          return (
            <li
              key={character.id}
              style={{
                backgroundColor: isHighlighted ? "#d3d3d3" : "transparent",
                cursor: "pointer",
                padding: "8px",
                border: isHighlighted
                  ? "1px solid #000"
                  : "1px solid transparent",
              }}
              onClick={() => handleClick(character)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave()}
            >
              {character.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CharacterList;
