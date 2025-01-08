import React from "react";
import "./styles.css";

function Input({
  label,
  state,
  setState,
  placeholder,
  type = "text",
  error = "",
  icon: Icon,
}) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {Icon && (
          <span className="input-icon">
            <Icon />
          </span>
        )}
        <input
          type={type}
          className={`input-field ${error ? "input-error" : ""} ${
            Icon ? "input-with-icon" : ""
          }`}
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder={placeholder}
          required
        />
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

export default Input;
