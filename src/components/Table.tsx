"use client";
import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Toast from "@/components/toast";
import DateTimePicker from "@/components/picker";
import {
  Button,
  Container,
  Title,
  Form,
  Input,
  ZoneGreen,
  ZoneRed,
  ZoneYellow,
  Label,
  Select,
} from "@/styles/basic";
import { styled } from "@stitches/react";
import { isValidDate, formatDate } from "@/utils/utils";
export type RowData = {
  id: number;
  [key: string]: any;
};

const statusOptions = ["Active", "Inactive", "Pending"];

// Stitches styled components
const TableWrapper = styled("div", {
  overflowX: "auto",
});

const TableElement = styled("table", {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #ddd",
  //   tableLayout: "fixed", // Ensures consistent column width
  boxSizing: "border-box", // Prevent overflow due to padding
  minWidth: "100%", // Ensure the table doesn't shrink below available width
});

const TableHeader = styled("th", {
  padding: "6px",
  color: "white",
  textAlign: "left",
  border: "1px solid #ddd",
  whiteSpace: "nowrap",
  overflow: "hidden", // Hide overflow in headers
  textOverflow: "ellipsis", // Show ellipsis for overflowing header text
});

const TableCell = styled("td", {
  padding: "6px",
  textAlign: "left",
  border: "1px solid #ddd",
  "&:hover": {
    backgroundColor: "lightgrey",
  },
  whiteSpace: "nowrap", // Prevent text wrapping in the cells
  overflow: "hidden", // Prevent text overflow if it's too long
  textOverflow: "ellipsis", // Add ellipsis for overflowing text
});

const TableRow = styled("tr", {
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

const Table = ({
  columns,
  data,
  onDataChange,
  deleteRow,
  bannedEdit,
}: {
  columns: ColumnDef<RowData>[];
  data: RowData[];
  onDataChange: (updatedData: RowData[]) => void;
  deleteRow?: (id: number) => void;
  bannedEdit?: string[];
}) => {
  const [enableEdit, SetEnableEdit] = useState(false);
  // Copy to clipboard
  const [enableCopy, SetEnableCopy] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(String(value));
    setToastMessage("Copied to clipboard!");
    setShowToast(true);
  };
  // Function to update a specific cell
  const updateData = (rowIndex: number, columnId: string, value: any) => {
    const newData = data.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: value } : row
    );
    onDataChange(newData); // Update parent state
  };

  const updateCoordinates = (
    rowIndex: number,
    columnId: string,
    value: any,
    LatLong: "lat" | "long" // Type for "lat" or "long"
  ) => {
    const newData = data.map((row, index) => {
      if (index === rowIndex) {
        const updatedGeolocation = { ...row.geolocation };

        if (LatLong === "lat") {
          updatedGeolocation.coordinates[1] = value; // Update latitude (index 1)
        } else if (LatLong === "long") {
          updatedGeolocation.coordinates[0] = value; // Update longitude (index 0)
        }

        return { ...row, geolocation: updatedGeolocation };
      }

      return row;
    });

    onDataChange(newData); // Update parent state
  };

  // Function to delete a row
  const deleteRowInteral = (rowIndex: number) => {
    if (deleteRow) deleteRow(rowIndex);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <Button
        color={enableCopy ? "red" : "blue"}
        onClick={() => SetEnableCopy(!enableCopy)}
      >
        {enableCopy ? "Turn off copy" : "Turn on copy"}
      </Button>
      <Button
        color={enableEdit ? "red" : "blue"}
        onClick={() => {
          SetEnableEdit(!enableEdit);
        }}
      >
        {enableEdit ? "Turn off edit" : "Turn on edit"}
      </Button>
      <TableWrapper>
        <TableElement>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeader key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHeader>
                ))}
                <TableHeader>Actions</TableHeader> {/* Delete column */}
              </TableRow>
            ))}
          </thead>
          {enableEdit ? (
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const cellValue = cell.getValue();

                    return (
                      <TableCell
                        onClick={() => {
                          if (enableCopy) {
                            copyToClipboard(
                              JSON.stringify(cellValue) as string
                            );
                          }
                        }}
                        key={cell.id}
                      >
                        {/* Handle different data types */}
                        {bannedEdit.includes(cell.column.id) ? (
                          <div>
                            🚫
                            {isValidDate(cellValue)
                              ? formatDate(cellValue)
                              : cellValue}
                          </div>
                        ) : cell.column.id === "geolocation" ? (
                          // {"type":"Point","crs":{"type":"name","properties":{"name":"EPSG:4326"}},"coordinates":[0,0]}
                          <div>
                            <p>Lat:</p>
                            <input
                              type="text"
                              value={cellValue?.coordinates[0]}
                              onChange={(e) =>
                                updateCoordinates(
                                  row.index,
                                  cell.column.id,
                                  e.target.value,
                                  "Lat"
                                )
                              }
                            />
                            <p>Long:</p>
                            <input
                              type="text"
                              value={cellValue?.coordinates[1]}
                              onChange={(e) =>
                                updateCoordinates(
                                  row.index,
                                  cell.column.id,
                                  e.target.value,
                                  "Long"
                                )
                              }
                            />
                          </div>
                        ) : isValidDate(cellValue) ? (
                          <DateTimePicker
                            value={cellValue}
                            onChange={(newValue) =>
                              updateData(row.index, cell.column.id, newValue)
                            }
                          />
                        ) : cell.column.id === "status" ? (
                          <select
                            value={cellValue as string}
                            onChange={(e) =>
                              updateData(
                                row.index,
                                cell.column.id,
                                e.target.value
                              )
                            }
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : typeof cellValue === "string" ||
                          typeof cellValue === "number" ? (
                          <input
                            type="text"
                            value={cellValue}
                            onChange={(e) =>
                              updateData(
                                row.index,
                                cell.column.id,
                                e.target.value
                              )
                            }
                          />
                        ) : Array.isArray(cellValue) ? (
                          <span>{cellValue.join(", ")}</span>
                        ) : typeof cellValue === "object" ? (
                          <span>{JSON.stringify(cellValue)}</span>
                        ) : typeof cellValue === "boolean" ? (
                          <input
                            type="checkbox"
                            checked={cellValue as boolean}
                            onChange={(e) =>
                              updateData(
                                row.index,
                                cell.column.id,
                                e.target.checked
                              )
                            }
                          />
                        ) : typeof cellValue === "function" ? (
                          <Button onClick={() => cellValue(row.original)}>
                            🏃‍♂️ Run
                          </Button>
                        ) : null}
                      </TableCell>
                    );
                  })}
                  {/* Delete button */}
                  <TableCell>
                    <Button
                      onClick={() => deleteRowInteral(row.index)}
                      color="red"
                    >
                      🗑️
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const cellValue = cell.getValue();
                    return (
                      <TableCell
                        onClick={() => {
                          if (enableCopy) {
                            copyToClipboard(
                              JSON.stringify(cellValue) as string
                            );
                          }
                        }}
                        key={cell.id}
                      >
                        {/* Handle different data types */}
                        {cell.column.id === "geolocation" ? (
                          // {"type":"Point","crs":{"type":"name","properties":{"name":"EPSG:4326"}},"coordinates":[0,0]}
                          <div>
                            {cellValue?.coordinates[0]},{" "}
                            {cellValue?.coordinates[1]}
                          </div>
                        ) : isValidDate(cellValue) ? (
                          <div>{formatDate(cellValue)}</div>
                        ) : cell.column.id === "status" ? (
                          <div>{cellValue}</div>
                        ) : typeof cellValue === "string" ||
                          typeof cellValue === "number" ? (
                          <div>{cellValue}</div>
                        ) : Array.isArray(cellValue) ? (
                          <span>{cellValue.join(", ")}</span>
                        ) : typeof cellValue === "object" ? (
                          <span>{JSON.stringify(cellValue)}</span>
                        ) : typeof cellValue === "boolean" ? (
                          <input
                            type="checkbox"
                            checked={cellValue as boolean}
                          />
                        ) : typeof cellValue === "function" ? (
                          <Button onClick={() => cellValue(row.original)}>
                            🏃‍♂️ Run
                          </Button>
                        ) : null}
                      </TableCell>
                    );
                  })}
                  {/* Delete button */}
                  <TableCell>
                    <Button
                      onClick={() => deleteRowInteral(row.index)}
                      color="red"
                    >
                      🗑️
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          )}
        </TableElement>
      </TableWrapper>
    </>
  );
};

export default Table;
