'use client';

import { FC, useMemo, useEffect, useState } from 'react';
import { styled } from '@stitches/react';

// Tooltip Components (using Stitches)
const TooltipContainer = styled('div', {
  position: 'relative',
  display: 'inline-block',
});

const TooltipText = styled('div', {
  visibility: 'hidden',
  width: '200px',
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'center',
  borderRadius: '5px',
  padding: '5px',
  position: 'absolute',
  zIndex: 1,
  left: '50%',
  marginLeft: '-100px',
  opacity: 0,
  transition: 'opacity 0.3s',
  whiteSpace: 'pre-wrap',
});

const TooltipContainerHover = styled(TooltipContainer, {
  '&:hover': {
    [`& ${TooltipText}`]: {
      visibility: 'visible',
      opacity: 1,
    },
  },
});

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: FC<TooltipProps> = ({ text, children }) => (
  <TooltipContainerHover>
    {children}
    <TooltipText>{text}</TooltipText>
  </TooltipContainerHover>
);

// Table Props Interface
interface TableProp {
  listHeader: Array<any>;
  listBody: Array<any>;
  listFunction: any;
  editById?: (id: any) => void;
  removeById?: (id: any) => void;
  viewById?: (id: any) => void;
  viewProfileById?: (id: any) => void;
  downloadById?: (id: any) => void;
  canSelect: boolean;
  rowSelected: Array<any>;
  setRowSelected: (rows: any[]) => void;
  disableFunction?: (id: any) => void;
  excludeFields?: Array<string>;
  showDefaultImage?: boolean;
  approveById?: (id: any) => void;
  validApprovalStatuses?: Array<string>;
  rejectById?: (id: any) => void;
  showNewTable?: boolean;
  validRejectionStatuses?: Array<string>;
}

// Styled Components for Table Layout
const TableContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  gap: '16px',
});

const PaginationContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '8px',
});

const TableWrapper = styled('div', {
  overflowX: 'auto',
  overflowY: 'hidden',
  boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
  borderRadius: '8px',
});

const StyledTable = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
});

const StyledTh = styled('th', {
  padding: '8px',
  textAlign: 'left',
  borderBottom: '1px solid #ccc',
});

const StyledTd = styled('td', {
  padding: '8px',
  borderBottom: '1px solid #eee',
});

const StyledTr = styled('tr', {});

const FunctionButton = styled('button', {
  border: 'none',
  borderRadius: '8px',
  padding: '8px',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  transition: 'background-color 0.15s ease-in',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});

// Dummy components for CheckBox, Pagination, Select, and PreviewAttachmentModal.
// Replace these with your own implementations.
const CheckBox: FC<{ checked: boolean; onChange: (val: boolean) => void }> = ({
  checked,
  onChange,
}) => (
  <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
);

const Pagination: FC<{ list: any[]; setList: (list: any[]) => void; pageCount: number }> = ({
  list,
  setList,
  pageCount,
}) => {
  // Dummy pagination for illustration
  return <div>Pagination</div>;
};

const Select: FC<{ options: any[]; value: any; onChange: (val: any) => void }> = ({
  options,
  value,
  onChange,
}) => (
  <select
    onChange={(e) =>
      onChange(options.find((opt) => opt.value === Number(e.target.value)) || options[0])
    }
    value={value.value}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const PreviewAttachmentModal: FC<{ file_url: string; close: () => void }> = ({
  file_url,
  close,
}) => (
  <div>
    <div>Preview: {file_url}</div>
    <button onClick={close}>Close</button>
  </div>
);

// Main Table Component
const Table: FC<TableProp> = ({
  listHeader,
  listBody,
  listFunction,
  editById,
  removeById,
  viewById,
  viewProfileById,
  downloadById,
  canSelect,
  rowSelected,
  setRowSelected,
  disableFunction,
  excludeFields = [],
  showDefaultImage = true,
  showNewTable = false,
  approveById,
  validApprovalStatuses = ['Pending'],
  rejectById,
  validRejectionStatuses = ['Pending'],
}) => {
  const [pageCount, setPageCount] = useState<number>(10);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const defaultExcludeFields = ['gender', 'status', 'image', 'id', 'alt_id'];
  const finalExcludeFields = defaultExcludeFields.filter(
    (field) => !excludeFields.includes(field)
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fileToPreview, setFileToPreview] = useState<string | null>(null);

  const isImageOrPdf = (value: string) => {
    return /\.(jpg|jpeg|png|pdf)$/.test(value);
  };

  const pageOptions = [
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];

  useEffect(() => {
    setFilteredList(listBody.slice(0, pageCount));
  }, [listBody, pageCount]);

  useMemo(() => {
    if (rowSelected.length === 0) setCheckAll(false);
  }, [rowSelected]);

  // Toggle individual row selection
  const onRowSelect = (val: number, checked: boolean) => {
    let list = [...rowSelected];
    if (!checked) {
      list = list.filter((v) => v !== val);
    } else {
      list.push(val);
    }
    setRowSelected(list);
  };

  // Toggle select all rows
  const onAllSelect = (checked: boolean) => {
    setCheckAll(checked);
    const list = checked ? listBody.map((val) => (val.alt_id ? val.alt_id : val.id)) : [];
    setRowSelected(list);
  };

  const openPreviewModal = (value: string) => {
    setFileToPreview(value);
    setIsModalOpen(true);
  };

  const isObjectOrArrayOfObjects = (value: any) => {
    if (Array.isArray(value)) {
      return value.every(
        (item) => item !== null && typeof item === 'object' && item.constructor === Object
      );
    }
    return value !== null && typeof value === 'object' && value.constructor === Object;
  };

  return (
    <TableContainer>
      {/* Pagination and Page Count Selector */}
      <PaginationContainer>
        {listBody.length > 10 && (
          <Pagination list={listBody} setList={setFilteredList} pageCount={pageCount} />
        )}
        {listBody.length > 10 && filteredList.length > 0 && (
          <Select
            options={pageOptions}
            value={pageOptions.find((val) => val.value === pageCount) || pageOptions[0]}
            onChange={(val: any) => setPageCount(val.value)}
          />
        )}
      </PaginationContainer>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              {canSelect && (
                <StyledTh>
                  <CheckBox checked={checkAll} onChange={onAllSelect} />
                </StyledTh>
              )}
              {listHeader
                .filter((head: any) => !['status', 'gender', 'id'].includes(head))
                .map((head: any, i: number) => (
                  <StyledTh key={i}>
                    {head?.header
                      ? head.header.replace(/_/g, ' ').replace(/filename/g, ' ')
                      : head.replace(/_/g, ' ').replace(/filename/g, ' ')}
                  </StyledTh>
                ))}
              {listFunction.length > 0 && <StyledTh>Function</StyledTh>}
            </tr>
          </thead>
          {filteredList.length > 0 && (
            <tbody>
              {filteredList.map((item: any) => (
                <StyledTr
                  key={item.id}
                  css={{ opacity: item.is_enable === 'Disable' ? 0.5 : 1 }}
                >
                  {canSelect && (
                    <StyledTd>
                      <CheckBox
                        checked={rowSelected.includes(item.alt_id ? item.alt_id : item.id)}
                        onChange={(checked: boolean) =>
                          onRowSelect(item.alt_id ? item.alt_id : item.id, checked)
                        }
                      />
                    </StyledTd>
                  )}
                  {showNewTable &&
                    listHeader &&
                    listHeader
                      .filter((head: any) => !['status', 'gender', 'id'].includes(head))
                      .map((head: any, i: number) => {
                        const key = head?.column_name ? head.column_name : head;
                        let value =
                          item[key] === 'null'
                            ? ''
                            : item[key] === false
                            ? 'False'
                            : item[key]
                            ? item[key]
                            : '';
                        const isImg =
                          typeof value === 'string' &&
                          /\.(jpg|jpeg|png|gif|bmp|svg)$/.test(value);
                        return (
                          <StyledTd
                            key={i}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            {isImg ? (
                              // Replace image with an emoji
                              <span>🖼️</span>
                            ) : key === 'name' ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {showDefaultImage && <span style={{ fontSize: '20px' }}>🏢</span>}
                                <div>
                                  <Tooltip text={value.title || ''}>
                                    <span
                                      style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '200px',
                                      }}
                                    >
                                      {value.title || value}
                                    </span>
                                  </Tooltip>
                                </div>
                              </div>
                            ) : key === 'rating' ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>⭐</span>
                                <span>{value || '0'}</span>
                              </div>
                            ) : head.header === 'Job Title' ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {editById && (
                                  <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => editById(item.id)}
                                  >
                                    👁️
                                  </span>
                                )}
                                <span>{value}</span>
                              </div>
                            ) : (
                              <div>
                                <Tooltip text={value}>
                                  <span
                                    style={{
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '250px',
                                    }}
                                  >
                                    {value}
                                  </span>
                                </Tooltip>
                              </div>
                            )}
                          </StyledTd>
                        );
                      })}
                  {!showNewTable &&
                    item &&
                    Object.keys(item).map((key: any, i: number) => {
                      if (finalExcludeFields.includes(key)) return null;
                      let value =
                        item[key] === 'null'
                          ? ''
                          : item[key] === 0
                          ? '0'
                          : item[key]
                          ? item[key]
                          : '';
                      const isImg =
                        typeof value === 'string' &&
                        /\.(jpg|jpeg|png|gif|bmp|svg)$/.test(value);
                      return (
                        <StyledTd
                          key={i}
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {isImg && key !== 'attachment' ? (
                            <span>🖼️</span>
                          ) : key === 'name' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {showDefaultImage && <span style={{ fontSize: '20px' }}>🏢</span>}
                              <div>
                                <Tooltip text={value.title || ''}>
                                  <span
                                    style={{
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '200px',
                                    }}
                                  >
                                    {value.title || value}
                                  </span>
                                </Tooltip>
                              </div>
                            </div>
                          ) : key === 'rating' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>⭐</span>
                              <span>{value}</span>
                            </div>
                          ) : key === 'attachment' ? (
                            <div>
                              {isImageOrPdf(value) ? (
                                <span
                                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                  onClick={() => openPreviewModal(value)}
                                >
                                  {value.split('/').pop()}
                                </span>
                              ) : (
                                <span>No Attachment</span>
                              )}
                            </div>
                          ) : isObjectOrArrayOfObjects(value) ? (
                            <span>{value?.name || 'False'}</span>
                          ) : (
                            <div>
                              <Tooltip text={value}>
                                <span
                                  style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '250px',
                                  }}
                                >
                                  {value}
                                </span>
                              </Tooltip>
                            </div>
                          )}
                        </StyledTd>
                      );
                    })}
                  {listFunction.length > 0 && (
                    <StyledTd>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
                        {listFunction.includes('profile') && viewProfileById && (
                          <FunctionButton onClick={() => viewProfileById(item.id)}>
                            <span>👤</span>
                          </FunctionButton>
                        )}
                        {listFunction.includes('edit') && editById && (
                          <FunctionButton onClick={() => editById(item.id)}>
                            <span>✏️</span>
                          </FunctionButton>
                        )}
                        {listFunction.includes('edit-profile') && editById && (
                          <FunctionButton onClick={() => editById(item.id)}>
                            <span>👤</span>
                          </FunctionButton>
                        )}
                        {listFunction.includes('view') && viewById && (
                          <FunctionButton onClick={() => viewById(item.id)}>
                            <span>👁️</span>
                          </FunctionButton>
                        )}
                        {listFunction.includes('email') && (
                          <FunctionButton>
                            <span>✉️</span>
                          </FunctionButton>
                        )}
                        {listFunction.includes('message') && (
                          <FunctionButton>
                            <span>💬</span>
                          </FunctionButton>
                        )}
                        {listFunction.includes('send') && (
                          <FunctionButton>
                            <span>📤</span>
                          </FunctionButton>
                        )}
                        {listFunction.includes('download') && downloadById && (
                          <FunctionButton onClick={() => downloadById(item.id)}>
                            <span>⬇️</span>
                          </FunctionButton>
                        )}
                        {listFunction.includes('feedback') && (
                          <FunctionButton>
                            <span>📝</span>
                          </FunctionButton>
                        )}
                        {approveById &&
                          listFunction.includes('approve') &&
                          validApprovalStatuses.includes(item.status) && (
                            <FunctionButton onClick={() => approveById(item.id)}>
                              <span>✅</span>
                            </FunctionButton>
                          )}
                        {rejectById &&
                          listFunction.includes('reject') &&
                          validRejectionStatuses.includes(item.status) && (
                            <FunctionButton onClick={() => rejectById(item.id)}>
                              <span>❌</span>
                            </FunctionButton>
                          )}
                        {listFunction.includes('disable') && disableFunction && (
                          <FunctionButton onClick={() => disableFunction(item.id)}>
                            <span>🚫</span>
                          </FunctionButton>
                        )}
                        {listFunction.includes('delete') && (
                          <FunctionButton onClick={() => removeById && removeById(item.id)}>
                            <span>🗑️</span>
                          </FunctionButton>
                        )}
                      </div>
                    </StyledTd>
                  )}
                </StyledTr>
              ))}
            </tbody>
          )}
        </StyledTable>
        {filteredList.length === 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '32px',
            }}
          >
            <span style={{ fontSize: '48px' }}>📄</span>
          </div>
        )}
      </TableWrapper>
      {isModalOpen && fileToPreview && (
        <PreviewAttachmentModal
          file_url={fileToPreview}
          close={() => setIsModalOpen(false)}
        />
      )}
    </TableContainer>
  );
};

export default Table;
