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
import Modal from "@/components/modal";
import SideBar from "@/components/Sidebar";

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
  None,
} from "@/styles/basic";
import { styled } from "@stitches/react";
import { isValidDate, formatDate } from "@/utils/utils";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import Link from "next/link";
import ViewProfile from "./viewProfile";
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
const Tooltip = styled("div", {
  position: "absolute",
  top: "80%",
  backgroundColor: "rgba(28, 56, 151, 0.9)",
  color: "#fff",
  padding: "8px",
  textTransform: "capitalize",
  borderRadius: "4px",
  visibility: "hidden",
  opacity: 0,
  transition: "opacity 0.2s ease, transform 0.2s ease",
});
const TooltipWrap = styled("div", {
  position: "relative",
  "&:hover": {
    [`${Tooltip}`]: {
      visibility: "visible",
      opacity: 1,
    },
  },
});
const TableCell = styled("td", {
  padding: "6px",
  textAlign: "left",
  border: "1px solid #ddd",

  whiteSpace: "nowrap", // Prevent text wrapping in the cells
  overflow: "hidden", // Prevent text overflow if it's too long
  textOverflow: "ellipsis", // Add ellipsis for overflowing text
});

const TableRow = styled("tr", {});

const StyledLink = styled(Link, {
  display: "block",
  padding: "16px",
  borderRadius: "12px",
  textDecoration: "none",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  // transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    // transform: "translateY(-5px)",
    boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
  },
});
type Action = {
  name: string;
  function: () => void;
  icon?: string;
};
const Table = ({
  columns,
  data,
  onDataChange,
  deleteRow,
  bannedEdit,
  actions,
}: {
  columns: ColumnDef<RowData>[];
  data: RowData[];
  onDataChange: (updatedData: RowData[]) => void;
  deleteRow?: (id: number) => void;
  bannedEdit?: string[];
  actions?: Action[];
}) => {
  const currentLocale = useLocale();
  const [enableEdit, SetEnableEdit] = useState(false);
  // Copy to clipboard
  const [enableCopy, SetEnableCopy] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [vacancyTypeOptions, setVacancyTypeOptions] = useState([]);
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [showExtra, setShowExtra] = useState(false);
  const [userProfileModalOpen, setUserProfileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const handleUserSelected = (user_id: string) => {
    if (user_id) {
      setSelectedUser(user_id);
      setUserProfileModalOpen(true);
    }
  };
  const handleRowHover = (index) => {
    console.log("hover", index);
    setExpandedRowIndex(index);
  };

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
  const RowDetails = styled("tr", {
    display: "flex",
    // display: "none",
    // "& td": {
    //   padding: "10px",
    //   backgroundColor: "#f9f9f9",
    //   borderTop: "1px solid #ddd",
    //   fontSize: "14px",
    // },
  });
  return (
    <>
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <SideBar
        isOpen={userProfileModalOpen && !!selectedUser}
        onClose={() => setUserProfileModalOpen(false)}
      >
        <ViewProfile user_id={selectedUser} />
      </SideBar>
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
      <Button
        color={showExtra ? "red" : "blue"}
        onClick={() => {
          setShowExtra(!showExtra);
        }}
      >
        {showExtra ? "Turn off extra information" : "Turn on extra information"}
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
                    ) ?? <None></None>}
                  </TableHeader>
                ))}
                {actions && actions.length > 0 && (
                  <TableHeader>Actions</TableHeader>
                )}
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
                        {bannedEdit &&
                        bannedEdit.length > 0 &&
                        bannedEdit.includes(cell.column.id) ? (
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
                        ) : cell.column.id === "location_id" ? (
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
                            {locationOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : cell.column.id === "location_ids" ? (
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
                            {locationOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : cell.column.id === "type_id" ? (
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
                            {vacancyTypeOptions.map((status) => (
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
                        ) : (
                          <None></None>
                        )}
                      </TableCell>
                    );
                  })}
                  {/* actions */}
                  <TableCell>🚫</TableCell>
                </TableRow>
              ))}
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  onMouseEnter={() => handleRowHover(rowIndex + 1)}
                  onMouseLeave={() => handleRowHover(null)}
                  key={row.id}
                >
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
                        {cell.column.id === "user_id" ? (
                          <div>
                            <Button
                              onClick={() => {
                                handleUserSelected(cellValue);
                              }}
                            >
                              👁️{cellValue}
                            </Button>
                            {/* <StyledLink href={`profile/${cellValue}`} passHref>
                              👁️{cellValue}
                            </StyledLink> */}
                          </div>
                        ) : cell.column.id === "geolocation" ? (
                          cellValue?.coordinates ? (
                            <div>
                              {cellValue.coordinates[0]},{" "}
                              {cellValue.coordinates[1]}
                            </div>
                          ) : (
                            <None></None>
                          )
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
                            readOnly
                            checked={cellValue as boolean}
                          />
                        ) : typeof cellValue === "function" ? (
                          <Button onClick={() => cellValue(row.original)}>
                            🏃‍♂️ Run
                          </Button>
                        ) : (
                          <None></None>
                        )}
                        {showExtra && expandedRowIndex === rowIndex + 1 && (
                          <RowDetails>
                            <td>
                              <div>
                                <strong>Additional Information:</strong>
                                {/* <p>{row.additionalInfo}</p> */}
                              </div>
                            </td>
                          </RowDetails>
                        )}
                      </TableCell>
                    );
                  })}
                  {actions && actions.length > 0 && (
                    <TableCell
                      style={{
                        gap: "5px",
                        display: "flex",
                        justifyContent: "center",
                        padding: "3px",
                        overflow: "visible",
                      }}
                      key={"actions"}
                    >
                      <div style={{ gap: "5px", display: "flex" }}>
                        {actions.map((action) => {
                          return (
                            <TooltipWrap key={action.name}>
                              <Button onClick={() => action.function()}>
                                {action.icon ?? action.name}
                              </Button>
                              <Tooltip>{action.name}</Tooltip>
                            </TooltipWrap>
                          );
                        })}
                      </div>
                    </TableCell>
                  )}
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
