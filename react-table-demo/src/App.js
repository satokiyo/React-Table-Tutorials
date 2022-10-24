import React from "react";
import "./App.css";
import { BasicTable } from "./components/BasicTable";
import { FilteringTable } from "./components/FiltertingTable";
import { StickyTable } from "./components/StickyTable";
import { PaginationTable } from "./components/PaginationTable";
import { RowSelection } from "./components/RowSelection";
import { MyTable } from "./components/MyTable";

function App() {
  return (
    <div className="App">
      {/*
      <BasicTable />
      <StickyTable />
      <FilteringTable />
      <PaginationTable />
      <RowSelection />
        */}
      <MyTable />
    </div>
  );
}

export default App;
