"use client";
import { useState, useEffect, lazy, Suspense } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { addQRCodeToLocation } from "@/utils/QR/store";
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
import { isValidDate, formatDate, hexToAscii } from "@/utils/utils";
import { useLocale } from "@/app/[locale]/hooks/useLocal";
import Link from "next/link";
// import ViewProfile from "./viewProfile";
import Loading from "./loading";
const ViewProfile = lazy(() => import("./viewProfile"));
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
  function: (id: string) => void;
  icon?: string;
};
type Entity<T> = {
  [key: string]: T[]; // The key is some identifier (e.g., vacancy_id), and the value is an array of T objects
};
const Table = ({
  data,
  onDataChange,
  deleteRow,
  bannedEdit,
  actions,
  expand,
  expandedData,
  expadedTitle,
}: {
  // columns: ColumnDef<RowData>[];
  data: RowData[];
  onDataChange: (updatedData: RowData[]) => void;
  deleteRow?: (id: number) => void;
  bannedEdit?: string[];
  actions?: Action[];
  expand?: Set<string> | null;
  expandedData?: Entity<any>;
  expadedTitle?: string;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

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
  const [enableFilter, setEnableFilter] = useState(false);
  const [enableSort, setEnableSort] = useState(false);
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
    navigator.clipboard.writeText(String(value).replace(/^"|"$/g, ""));
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
  async function generateQRCodeForLocation(location_id: string) {
    await addQRCodeToLocation(location_id);
  }
  const columns = data.length
    ? Object.keys(data[0]).map((key) => ({
        accessorKey: key,
        header: ({ column }) => (
          <div>
            {key.charAt(0).toUpperCase() + key.slice(1)}
            {enableFilter && (
              <input
                type="text"
                value={column.getFilterValue() || ""}
                onChange={(e) => column.setFilterValue(e.target.value)}
                placeholder={`Filter ${key}`}
              />
            )}
          </div>
        ),
        enableSorting: true,
      }))
    : [];
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFromLeafRows: true,
  });
  const RowDetails = styled("tr", {
    display: "flex",
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
        <Suspense fallback={<Loading />}>
          <ViewProfile user_id={selectedUser} />
        </Suspense>
      </SideBar>
      <Button
        color={enableCopy ? "red" : "blue"}
        onClick={() => SetEnableCopy(!enableCopy)}
      >
        {enableCopy ? "Turn off copy" : "Copy"}
      </Button>
      <Button
        color={enableEdit ? "red" : "blue"}
        onClick={() => {
          SetEnableEdit(!enableEdit);
        }}
      >
        {enableEdit ? "Turn off edit" : "Edit"}
      </Button>
      <Button
        color={showExtra ? "red" : "blue"}
        onClick={() => {
          setShowExtra(!showExtra);
        }}
      >
        {showExtra ? "Turn off extra information" : "Extra information"}
      </Button>
      <Button
        color={enableFilter ? "red" : "blue"}
        onClick={() => {
          setEnableFilter(!enableFilter);
        }}
      >
        {enableFilter ? "Turn off filters" : "Filter"}
      </Button>
      <Button
        color={enableSort ? "red" : "blue"}
        onClick={() => {
          setEnableSort(!enableSort);
        }}
      >
        {enableSort ? "Turn off sort" : "Sort"}
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
                    ) ?? <None />}
                    {enableSort && (
                      <div>
                        <Button
                          style={{
                            padding: "0",
                            background: "transparent",
                            margin: "0px 5px",
                          }}
                          onClick={() => header.column.toggleSorting(true)}
                        >
                          ↑
                        </Button>
                        <Button
                          style={{
                            padding: "0",
                            background: "transparent",
                            margin: "0px 5px",
                          }}
                          onClick={() => header.column.toggleSorting(false)}
                        >
                          ↓
                        </Button>
                        <Button
                          style={{
                            padding: "0",
                            background: "transparent",
                            margin: "0px 5px",
                          }}
                          onClick={() => header.column.clearSorting()}
                        >
                          ◦
                        </Button>
                      </div>
                    )}
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
              {table.getSortedRowModel().rows.map((row) => (
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
                        {/* Lock credits */}
                        {cell.column.id === "location_qr" ? (
                          <div>🚫</div>
                        ) : bannedEdit &&
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
                <>
                  <TableRow
                    onMouseEnter={() =>
                      showExtra && handleRowHover(rowIndex + 1)
                    }
                    onMouseLeave={() => showExtra && handleRowHover(null)}
                    key={row.id}
                  >
                    <>
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
                            {cell.column.id === "location_qr" &&
                            data[row.id] &&
                            data[row.id].id &&
                            !hexToAscii(cellValue) ? (
                              <div>
                                <Button
                                  onClick={() => {
                                    generateQRCodeForLocation(data[row.id].id);
                                  }}
                                >
                                  Generate QR
                                </Button>
                              </div>
                            ) : cell.column.id === "location_qr" ? (
                              <div>{hexToAscii(cellValue)}</div>
                            ) : cell.column.id === "user_id" ? (
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
                                <TableCell>
                                  <div>
                                    <strong>Additional Information:</strong>
                                    {/* <p>{row.additionalInfo}</p> */}
                                  </div>
                                </TableCell>
                              </RowDetails>
                            )}
                          </TableCell>
                        );
                      })}
                      {actions && actions.length > 0 && (
                        <TableCell key={"actions"}>
                          <div
                            style={{
                              gap: "5px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {actions.map((action) => {
                              return (
                                <TooltipWrap key={action.name}>
                                  <Button
                                    onClick={() => action.function(row.id)}
                                  >
                                    {action.icon ?? action.name}
                                  </Button>
                                  <Tooltip>{action.name}</Tooltip>
                                </TooltipWrap>
                              );
                            })}
                          </div>
                        </TableCell>
                      )}
                    </>
                  </TableRow>
                  {expand && expand.has(row.id) && expandedData && (
                    <TableRow colSpan="100%" style={{ width: "100%" }}>
                      <td
                        colSpan="100%"
                        style={{ padding: "20px 0px", width: "100%" }}
                      >
                        {expandedData[row.id] && (
                          <Table
                            data={expandedData[row.id]}
                            style={{ width: "100%" }}
                          />
                        )}
                      </td>
                    </TableRow>
                    // {expadedTitle ?? "Additional Information:"}
                  )}
                </>
              ))}
            </tbody>
          )}
        </TableElement>
      </TableWrapper>
    </>
  );
};

export default Table;

// Memoization: Memoization is a technique where you store the results of expensive function calls so that you don't have to repeat them. You can use memoization libraries like react-use or use-memo to cache the results of function calls.
// Lazy Loading: If you have a lot of data that you don't need to display immediately, consider using lazy loading to load it only when it's needed.
// Caching: If you have data that doesn't change frequently, consider caching it so that you don't have to fetch it from the server every time.
// Avoid Unnecessary Re-renders: Make sure that you're not re-rendering components unnecessarily. You can use React.memo or useCallback to memoize functions and prevent unnecessary re-renders.
// 6. Code Organization
