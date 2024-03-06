import React from 'react';
import { FormFieldProps } from '../../utils/types/commonTypes';

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="mb-3 fw-bold">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormField;