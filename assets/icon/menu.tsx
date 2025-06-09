import React, { useState } from "react";

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <TouchableOpacity onPress={() => setOpen(!open)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        strokeWidth="2.5"
        stroke="#1C1C22"
        fill="none"
        className={`duration-300 transform transition-all ${open ? "rotate-90" : ""}`}
        style={{ width: "24px", height: "24px" }}
      >
        <path d="M7.68 32h48.64M7.68 15.97h48.64M7.68 48.03h48.64"></path>
      </svg>
    </TouchableOpacity>
  );
};

export default Menu;
