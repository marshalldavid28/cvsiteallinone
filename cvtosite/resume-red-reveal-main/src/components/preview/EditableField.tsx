
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckIcon, XIcon, PencilIcon } from "lucide-react";

interface EditableFieldProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  multiline?: boolean;
  label?: string;
  placeholder?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  className = "",
  multiline = false,
  label,
  placeholder = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  
  // Update tempValue when the incoming value changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);
  
  // Detect if we're in light mode by checking if any ancestor has the 'bg-white' class
  const isLightMode = document.querySelector('body')?.classList.contains('light-mode');

  const handleSave = () => {
    try {
      onChange(tempValue);
      setIsEditing(false);
      toast.success("Updated successfully", {
        duration: 2000,
        dismissible: true
      });
    } catch (error) {
      console.error("Error saving update:", error);
      toast.error("Failed to save update");
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSave();
    }
    // Cancel on Escape
    else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className={`group relative ${className}`}>
        {label && <span className="text-xs text-gray-400 hidden group-hover:block absolute -top-5 left-0">{label}</span>}
        <div className="inline-flex items-center">
          <span className="break-words">{value || placeholder}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 ml-2"
            onClick={() => {
              setIsEditing(true);
              setTempValue(value); // Ensure we start with the current value
            }}
          >
            <PencilIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-xs text-gray-400">{label}</span>}
      {multiline ? (
        <Textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className={isLightMode ? "min-h-[80px] bg-gray-100" : "min-h-[80px] bg-gray-800"}
          placeholder={placeholder}
          autoFocus
          onKeyDown={handleKeyDown}
        />
      ) : (
        <Input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className={isLightMode ? "bg-gray-100" : "bg-gray-800"}
          placeholder={placeholder}
          autoFocus
          onKeyDown={handleKeyDown}
        />
      )}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-green-700/20 hover:bg-green-700/30 text-green-200 hover:text-green-100 z-10"
          onClick={handleSave}
          type="button"
        >
          <CheckIcon className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-red-700/20 hover:bg-red-700/30 text-red-200 hover:text-red-100 z-10"
          onClick={handleCancel}
          type="button"
        >
          <XIcon className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Pro tip: Press Ctrl+Enter to save, Esc to cancel
      </div>
    </div>
  );
};

export default EditableField;
