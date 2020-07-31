import React from "react";
import ReactDOM from "react-dom";
import { Table } from "./Components";

// TODO: create separated file for css
const css = {
  width: "max-content",
};

const router = (
  <div style={css}>
    <Table x={10} y={4} id="1" />
  </div>
);

ReactDOM.render(router, document.getElementById("root"));
