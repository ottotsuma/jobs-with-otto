const renderInputField = (name: string, value: any) => {
  const fieldType = typeof value;

  switch (fieldType) {
    case "string":
      return (
        <Input type="text" name={name} value={value} onChange={handleChange} />
      );
    case "number":
      return (
        <Input
          type="number"
          name={name}
          value={value || ""}
          onChange={handleChange}
        />
      );
    case "boolean":
      return (
        <Select name={name} value={value} onChange={handleChange}>
          <option value="true">True</option>
          <option value="false">False</option>
        </Select>
      );
    case "object":
      if (Array.isArray(value)) {
        return (
          <Select name={name} value={value || ""} onChange={handleChange}>
            <option value="">Select Option</option>
            {value.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name || item.id}
              </option>
            ))}
          </Select>
        );
      }
      return (
        <Input
          type="text"
          name={name}
          value={value || ""}
          onChange={handleChange}
        />
      );
    default:
      return null;
  }
};
