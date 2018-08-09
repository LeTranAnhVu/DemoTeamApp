import React from "react";
import { Table, Button } from 'semantic-ui-react';
class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.parseRow = this.parseRow.bind(this);
    // this.unassignHandler = this.unassignHandler.bind(this);
    this.genTableHeaders = this.genTableHeaders.bind(this);
    this.genTableBody = this.genTableBody.bind(this);
    this.genhandlers = this.genhandlers.bind(this);
  }
  parseRow(cell) {
    if (Array.isArray(cell)) {
      let cellData = cell.join(",");
      return cellData;
    }
    return cell;

  }

  onHandler(rowId, handler) {
    let clickedRow = this.props.data.rows[rowId];
    handler(clickedRow);
  }

  chooseColumn(dataColumns) {
    let notShowColumns = {};
    if (Array.isArray(this.props.notShowColumns)) {
      this.props.notShowColumns.forEach(col => {
        notShowColumns[col] = true;
      });
    }
    let filtedColumns = dataColumns.filter(column => {
      if (notShowColumns[column] != undefined) {
        //this col should not be showed
      }
      else {
        return column;
      }
    });
    console.log(filtedColumns);
    return filtedColumns;

  }
  genTableHeaders(choosedCol) {
    return (
      <Table.Row>
          {choosedCol.map((column,i)=> {
                return <Table.HeaderCell key={i}>{column}</Table.HeaderCell>; })
          }
      </Table.Row>
    );
  }


  genTableBody(choosedCol, dataRows, handlers) {
    return dataRows.map((row, ir) => {
      return (
        <Table.Row key={ir}>
          {choosedCol.map((column,ic)=> {
            return <Table.Cell key={ic}>{this.parseRow(row[column])}</Table.Cell>; })
          }
          {
            handlers.map(handler=>{
              return this.genhandlers(handler,ir);
            })
          }
        </Table.Row>);
    });
  }

  genhandlers(handler, rowIndex) {
    return <Table.Cell key={rowIndex} ><Button basic color='red' size='mini' onClick={()=>this.onHandler(rowIndex,handler.handler)}>{handler.handlerName}</Button></Table.Cell>
  }



  render() {
    // Data
    let dataColumns = this.props.data.columns;
    let dataRows = this.props.data.rows;
    let choosedCol = this.chooseColumn(dataColumns);

    let tableHeaders = this.genTableHeaders(choosedCol);
    let handlers = this.props.listOfHandler;
    if (!Array.isArray(handlers)) {
      handlers = [];
    }
    let tableBody = this.genTableBody(choosedCol, dataRows, handlers);

    //table body


    return (<Table fixed>
        <Table.Header>
            {tableHeaders}
         </Table.Header>
        <Table.Body>
            {tableBody}
        </Table.Body>
      </Table>)
  }
};

module.exports = TableComponent;
