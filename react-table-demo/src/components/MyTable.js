import React, { useMemo, useState, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useBlockLayout,
  useFilters,
  useGlobalFilter,
} from "react-table";
import { useSticky } from "react-table-sticky";
import MOCK_DATA from "./MOCK_DATA.json";
import { COLUMNS } from "./columns";
import { Styles } from "./TableStyles";
import "./table.css";
import { Checkbox } from "./Checkbox";
import { GlobalFilter } from "./GlobalFilter";
import { ColumnFilter } from "./ColumnFilter";
import axios from "axios";

export const MyTable = () => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => MOCK_DATA, []);
  const defaultColumn = useMemo(
    () => ({
      Filter: ColumnFilter,
    }),
    []
  );

  // tmp
  const url = "";
  const [sheetData, setSheetData] = useState([]);
  // const fetchSheetData = async () => {
  const fetchSheetData = () => {
    //const response = await axios.get(url).catch((err) => console.log(err));
    //if (response) {
    // const sheetData = response.data;
    // tmp
    const _sheetdata = MOCK_DATA;

    setSheetData(_sheetdata);

    //}
  };
  const sheetRowsData = useMemo(() => [...sheetData], [sheetData]);
  const sheetRowsColumns = useMemo(
    () =>
      sheetData[0]
        ? Object.keys(sheetData[0])
            .filter((key) => !(key in ["not-use-column-name"]))
            .map((key) => {
              return { Headers: key, accessor: key };
            })
        : [],
    [sheetData]
  );
  useEffect(() => {
    fetchSheetData();
  }, []); // 依存関係なし。初回レンダリング時のみ実行

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const response = await axios
      .get("https://fakestoreapi.com/products")
      .catch((err) => console.log(err));

    if (response) {
      const products = response.data;

      console.log("Products: ", products);
      setProducts(products);
    }
  };

  const productsData = useMemo(() => [...products], [products]);

  const productsColumns = useMemo(
    () =>
      products[0]
        ? Object.keys(products[0])
            .filter((key) => key !== "rating")
            .map((key) => {
              if (key === "image")
                return {
                  Header: key,
                  accessor: key,
                  Cell: ({ value }) => <img src={value} />,
                  maxWidth: 70,
                };

              return { Header: key, accessor: key };
            })
        : [],
    [products]
  );

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      {
        id: "selection",
        sticky: "left",
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <Checkbox {...getToggleAllRowsSelectedProps()} />
        ),
        Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
      },
      ...columns,
      {
        id: "Edit",
        Header: "Edit",
        Cell: ({ row }) => (
          <button onClick={() => alert("Editing: " + row.values.price)}>
            Edit
          </button>
        ),
      },
    ]);
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      // sheetRowsData,
      //productsColumns,
      //productsData,

      defaultColumn,
    },
    useBlockLayout,
    useSticky,
    useFilters,
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    tableHooks
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    selectedFlatRows,
    state,
  } = tableInstance;

  useEffect(() => {
    fetchProducts();
  }, []);

  const { globalFilter } = state;

  // const firstPageRows = rows.slice(0, 10);
  const firstPageRows = rows;

  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table {...getTableProps()} className="table sticky">
        <header className="header">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <th
                  //{...column.getHeaderProps(column.getSortByToggleProps())}
                  {...column.getHeaderProps()}
                  className="th"
                >
                  {column.render("Header")}
                  {column.canSort ? (
                    <button
                      {...column.getSortByToggleProps()}
                      className="sortButton"
                    >
                      {column.isSorted
                        ? column.isSortedDesc
                          ? "↓"
                          : "↑"
                        : "↕"}
                    </button>
                  ) : null}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </header>
        <tbody {...getTableBodyProps()} className="tbody">
          {firstPageRows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="td">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map((row) => row.original),
            },
            null,
            2
          )}
        </code>
      </pre>
    </>
  );
};
