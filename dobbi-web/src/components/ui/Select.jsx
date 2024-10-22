import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/Label";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Select({
  label,
  id,
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option",
  icon: Icon,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (option) => {
    onValueChange(option.value); // Set the selected value
    setIsOpen(false); // Close the dropdown after selecting
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev); // Toggle dropdown
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="space-y-2" ref={selectRef}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <button
          type="button"
          id={id}
          className={cn(
            "w-full pl-10 pr-10 py-2 text-left border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
            className
          )}
          onClick={toggleDropdown}
          {...props}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </button>
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        )}
        <ChevronDown
          className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 transition-transform",
            isOpen && "rotate-180"
          )}
        />
        {isOpen && options.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(option)} // Select option and close dropdown
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
