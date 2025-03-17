import Papa from "papaparse";

const handleFileUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  setTableData
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      const parsedData = result.data as RowData[];
      setTableData(parsedData);
    },
  });
};

return (
  <div>
    <input type="file" accept=".csv" onChange={handleFileUpload} />
  </div>
);
