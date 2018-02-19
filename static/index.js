

var global_fileForTransfer;
var global_loadDataEmpty={
  columns: ['#', 'File', 'Upload date', 'Upload time'],
  rows: [{
    '#': "-",
    'File': "-",
    'Upload date': '-',
    'Upload time': "-"
  }]};

var global_loadData={};
var global_currentTableDataID = 1;


//----------------------------------------------------------------------------------------
//Drag 'n Drop functions
//----------------------------------------------------------------------------------------



function updateTable() {

    console.log('table update inside func');
    var ajax = new XMLHttpRequest();
    ajax.open('GET', '/updatetable', true);
    ajax.send();
    var myArr ={};
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            global_loadData = JSON.parse(this.responseText);
            console.log('got json');
            console.log(global_loadData);
            global_currentTableDataID = global_loadData.rows.length - 1;
            console.log('Current table #: ' + (global_loadData.rows.length - global_currentTableDataID) + '  Current data id: ' + global_currentTableDataID)
            ReactDOM.render(<TableBlock data = {global_loadData}/>,window.document.getElementById('table'));
        }
        else {
            //ReactDOM.render(<TableBlock data = {global_loadDataEmpty}/>,window.document.getElementById('table'));
        }
    };
}


function renderPage() {
    ReactDOM.render(<TitleBlock />,window.document.getElementById('title'));
    updateTable();
}


function changeLoadButtonName(name){
  console.log(name)
  ReactDOM.render(
      name,
      document.getElementById('loadButtonText')
  );

}

function onChangeDropZone(name) {
    document.getElementById('drop_zone').value = name;
    changeLoadButtonName(name);
}


function sendButton() {
    if (global_fileForTransfer) {
        sendDropedFile(global_fileForTransfer);

    }
    else {
        document.getElementById('button_hidden').click();
        updateTable();
        console.log('table reload');

    }
}


function sendDropedFile(file) {

  var ajax = new XMLHttpRequest();
  ajax.open('POST', '/uploadfile', true);
  var formData = new FormData();
  formData.append("file", file);
  ajax.send(formData);
  ajax.onreadystatechange = function() {
        if (this.status == 204) {
            console.log('request to ypdate table');
            updateTable();
        }
        else {
            //ReactDOM.render(<TableBlock data = {global_loadDataEmpty}/>,window.document.getElementById('table'));
        }
    };

}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files;
  global_fileForTransfer = files[0]
  // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  if (files.length > 0) {
      document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }
  // for (var i = 0, f; f = files[i]; i++) {
  //   output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
  //               f.size, ' bytes, last modified: ',
  //               f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
  //               '</li>');
  // }
  //sendDropedFile(files[0]);

  changeLoadButtonName(files[0].name);

}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);



//----------------------------------------------------------------------------------------
//REACT classes
//----------------------------------------------------------------------------------------


class TitleBlock extends React.Component {
    render() {
        return (
            <div className="title2">
                <h1>TEST PROJECT</h1>
                <p>Powered by React + D3 on frontend and Flask + OpenPyxl + TinyDB on backend server </p>
            </div>
        );
    }
}




class TableHeader extends React.Component {
    render() {
        console.log(this.props.columns);
        return (
            <thead>
                <tr>
                    {
                        this.props.columns.map(function(column) {
                                return <th>{column}</th>;
                        })
                    }
                </tr>
            </thead>
        );
    }
}


class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.chosenRow = 0;
        this.rowClick =this.rowClick.bind(this);
        this.state = {rownumber: this.props.id}
    }

    rowClick() {
        console.log("Clicked row #: " + this.state.rownumber);
        this.chosenRow = this.state.rownumber;
        console.log("chosenRow = " + this.chosenRow);
        this.props.rowClick(this.chosenRow)
    }

    render() {
        return (
            <tr onClick={this.rowClick}>
                <td>{this.props.tableposition}</td>
                <td>{this.props.data['File']}</td>
                <td>{this.props.data['Upload date']}</td>
                <td>{this.props.data['Upload time']}</td>
            </tr>
        );
    }
}


class TableBody extends React.Component {
    constructor(props) {
        super(props);
        this.tableClick = this.tableClick.bind(this);
        this.rowClick =this.rowClick.bind(this);
        this.chosenRow = 0;
    }

    //Handles click on child TableRow obj
    rowClick() {
    }

    //Handles click on table to pass it to main Table object(TableBlock)
    tableClick(_chosenRow) {
        this.chosenRow = _chosenRow;
        console.log("chosenRow in Table = " + _chosenRow);
        this.props.tableClick(_chosenRow)
    }

    render() {
        console.log(this.props.rows);
        var rows = [];
        var length = this.props.rows.length;
        var counter = 1;
        var revertedRow = length - 1;
        for (var row in this.props.rows) {

            console.log(row, this.props.rows[revertedRow])
            // for (var el in this.props.rows[row]) {
            //     console.log(el, this.props.rows[row][el])
            // }
            rows.push(<TableRow key={revertedRow} data={this.props.rows[revertedRow]}
                                id={this.props.rows[revertedRow]['id']} tableposition={counter}
                                rowClick={this.tableClick}/>);
            counter++;
            revertedRow--;
        }
        return (
            <tbody>
                {rows}
            </tbody>
        );

    }

}


class TableButton extends React.Component {
    constructor(props) {
        super(props);
        this.buttonClick= this.buttonClick.bind(this)
        this.chosenRow = 11;
        // this.state = {buttonText: "Show graph # 1"};
    }

    buttonClick() {
        window.location.href = "#drawboard";
        console.log(global_loadData.rows[1]['File']);
        console.log(global_loadData.rows[0]['File']);
        ReactDOM.render(<TableBlock data = {global_loadData}/>,window.document.getElementById('table'));
        showGraph(global_currentTableDataID);
    }

    render() {
        var text ='';
        if (this.props.currentrow == 1) {
            text = "Show last uploaded graph"
        }
        else {
            text = "Show graph # " + this.props.currentrow.toString()
        }
        return (
            <button className="btn-class" onClick={this.buttonClick}>
                {text}
                {/*/!*Show graph #{this.state.currentRowID}*!/*/}
                {/*Show graph #{this.props.currentrow}*/}
            </button>
        );
    }
}



class TableBlock extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.data.columns);
        console.log(this.props.data.rows);
        this.state = {currentRowID: global_currentTableDataID};
        this.handleTableClick = this.handleTableClick.bind(this);
    }

    //Handles click on child TableBody obj
    handleTableClick(_chosenRow) {
        console.log("Main block row #: " + _chosenRow);
        this.setState (prevState => ({
            // currentRowID: prevState.currentRowID+1
            currentRowID: _chosenRow
        }));
        global_currentTableDataID = _chosenRow;
        console.log('Current table #: ' + (this.props.data.rows.length - global_currentTableDataID) + '  Current data id: ' + global_currentTableDataID)
    }


    render() {
        return (
            <div>
                <table className="customTable">
                    <TableHeader columns={this.props.data.columns}/>
                    <TableBody columns={this.props.data.columns} rows={this.props.data.rows} tableClick={this.handleTableClick}/>

                    {/*<button className={"btn-class"} currentrow={this.state.currentRowID} onClick={this.handleClick}>Just a button #{this.state.currentRowID}</button>*/}
                </table>
                <div className="customSpace"></div>
                <TableButton currentrow={this.props.data.rows.length - global_currentTableDataID} buttonClick={this.handleTableClick}/>
            </div>
        );
    }
}

renderPage();



//ReactDOM.render(<TableBlock data = {tableData}/>,window.document.getElementById('table-component'));
//ReactDOM.render(<AppBlock/>, window.document.getElementById("app"));

//ReactDOM.render(<BotBlock/>, window.document.getElementById("bot"));
//ReactDOM.render(<ToggleButton />, window.document.getElementById('table-button'));


























var tableData = {
      columns: ['#', 'File', 'Upload date', 'Upload time'],
      rows: [{
        '#': 1,
        'File': 50,
        'Upload date': '1 Hour',
        'Upload time': 12
      }, {
        '#': 2,
        'File': 50,
        'Upload date': '1 Hour',
        'Upload time': 12
      }, {
        '#': 3,
        'File': 50,
        'Upload date': '1 Hour',
        'Upload time': 12
      }, {
        '#': 4,
        'File': 50,
        'Upload date': '1 Hour',
        'Upload time': 12
      }, {
        '#': 5,
        'File': 50,
        'Upload date': '1 Hour',
        'Upload time': 12
      }, {
        '#': 6,
        'File': 50,
        'Upload date': '1 Hour',
        'Upload time': 12
      }, {
        '#': 7,
        'File': "Text1.txt",
        'Upload date': '1 Hour',
        'Upload time': 12
      }]
};
//import customData from './customData.json';
//console.log(customData);




// var str = JSON.stringify(tableData);
// console.log(str);
// var data2 = JSON.parse(str);
// console.log('tabledata:');
// console.log(tableData);
// console.log('data2');
// console.log(data2);



//ReactDOM.render(<Welcome name={"leo"} />, document.getElementById('table-text'));















class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }


  render() {
    // Data
    var dataColumns = this.props.data.columns;
    var dataRows = this.props.data.rows;

    var tableHeaders = (<thead>
          <tr>
            {dataColumns.map(function(column) {
              return <th>{column}</th>; })}
          </tr>
      </thead>);

    var tableBody = dataRows.map(function(row) {
      return (
        <tr>
          {dataColumns.map(function(column) {
            return <td >{row[column]}</td>; })}
          {/*<button>Show this graph</button>*/}
        </tr>); });

    // Decorate with Bootstrap CSS
    return (<table width="100%">
        {tableHeaders}
        {tableBody}
      </table>) }
}

// Example Data


//ReactDOM.render(<TableComponent data = {tableData} />,window.document.getElementById('table-component'));