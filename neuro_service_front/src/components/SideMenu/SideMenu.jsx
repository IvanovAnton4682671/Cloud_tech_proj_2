import React from "react";
import styles from "./SideMenu.module.css";

function SideMenu({ onSelect }) {
  const [selected, setSelected] = React.useState(null);

  const handleClick = (index) => {
    setSelected(index);
    onSelect(index);
  };

  return (
    <div className={styles.verticalMenu}>
      {["Генератор текста", "Генератор картинок", "Речь в текст"].map(
        (item, index) => (
          <div
            key={index}
            className={`${styles.elemMenu} ${
              selected === index ? styles.selected : ""
            }`}
            onClick={() => handleClick(index)}
          >
            {item}
          </div>
        )
      )}
    </div>
  );
}

export default SideMenu;
