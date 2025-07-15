import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  required = false,
  className = "",
  ...inputProps 
}) => {
  return (
    <div className={className}>
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input error={error} {...inputProps} />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;