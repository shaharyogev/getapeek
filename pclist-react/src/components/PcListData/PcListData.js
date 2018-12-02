import React, {Component} from 'react';
import './PcListData.css';
var countPath = 0;
var filePath = ['/'];
var allRespons = [];
allRespons[countPath] = [];

let indexResponse = (data)=>{
    allRespons[countPath] = data;    
}

class pcListData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pcListFiles: [],
      peek: [],
      key: '',
      mouseLocationX: 0,
      mouseLocationY: 0,
      isHovered: false,
      darkTheme: true,
      theme: 'Light',
    };

    this.darkThemeHandler = this.darkThemeHandler.bind(this);
  }

  //Will fetch the json from the Nodejs server
  componentDidMount() {
    fetch('/pclistdata')
      .then(response => response.json())
      .then(data => indexResponse(data))
      .then(data => this.changeList(0))
      .catch(err => console.log('Fatch eer is:' + err))
  }

  //Activete the hover state for the folderPeek and mousePosition functions
  handleHoverEnter = () => {
    this.setState(() => ({
      isHovered: true
    }));
  }

  //Deactivete the hover mode for the peek function
  handleHoverLeave = () => {
    this.setState(() => ({
      isHovered: false
    }));
  }

  //Will triger the dark mode on the app
  darkThemeHandler = () => {
    this.setState(state => ({
      darkTheme: !state.darkTheme
    }));
    var on = this.state.darkTheme;
    if (on) {
      document.body.style = '--background-color:black';
      this.setState({
        theme: 'Dark',
      })
    } else {
      document.body.style = '--background-color:#eee';
      this.setState({
        theme: 'Light',
      })
    }
  }

  //Represent the corent state of the main component 
  changeList = (index) => {
    this.setState({
      pcListFiles: allRespons[index]
    })
  }

  //The main function for the peek state
  folderPeek = (index, obj) => {
    try {
      if (obj === "file") {
        this.setState({
          peek: [{
            Name: 'This is a file',
            Type: "non"
          }]
        })

      } else if (obj === "emptyFolder") {
        this.setState({
          peek: [{
            Name: 'This is a ampty folder',
            Type: "non"
          }]
        })

      } else {
        this.setState({
          peek: this.state.pcListFiles[index].Dir
        })
      }
    } catch (error) {
      console.log('folderPeek did not work: ' + error);
    }
  }
  //Set the state for the mouse position on hover on the corent folder
  mousePosition = (pageX, pageY) => {
    try {
      this.setState({
        mouseLocationX: pageX,
        mouseLocationY: pageY
      })
    } catch (error) {
      console.log('folderPeek did not work: ' + error);
    }
  }
  //Idicate the type of every file
  fileType = (dir, type) => {
    if (dir.length === 0 && type === '') {
      return 'emptyFolder';
    } else if (dir.length === 0) {
      return 'file';
    } else {
      return 'folder';
    }
  }

  //For every click this function will naveget in the files tree. Read careffuly!
  fileNameHandler = (props) => {
    if ((props === 'backLibrary' || props === 'homeLibrary') && countPath === 0) {
      countPath = 0;
      return this.changeList(0);
    } else if (props === 'backLibrary') {
      countPath--;
      return this.changeList(countPath)
    } else if (props === 'homeLibrary') {
      countPath = 0;
      return this.changeList(0)
    } else if (this.fileType(props.Dir, props.Type) === 'file') {
      return (
        this.handleHoverEnter(),
        this.setState({
          peek: [{
            Name: 'This is not a folder',
            Type: "non"
          }]
        })
      )
    } else if (this.fileType(props.Dir, props.Type) === 'emptyFolder') {
      return (
        this.handleHoverLeave(),
        this.setState({
          pcListFiles: []
        }),
        countPath++
      )
    } else {
      countPath++;
      var fileNameData = props.Name;
      filePath[countPath] = filePath[countPath - 1] + fileNameData + '/';
    };

    var filePathJson = JSON.stringify(filePath);
    this.handleHoverLeave()

    //Will fetch the data base on the clicked file
    fetch('/pclistdata', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileNameData: fileNameData,
          countPath: countPath,
          filePathJson: filePathJson,
        })
      })
      .then(response => response.json())
      .then(data => indexResponse(data))
      .then(data => this.changeList(countPath))
  }

render() {
  return (
    <div>
      <h1 className={'h1Main'+this.state.theme}>Get a peek to the folders in the server:</h1>
      <button className={'buttonTop'+this.state.theme} onClick={()=> this.fileNameHandler('backLibrary') }> Back</button>
      <button className={'buttonTop'+this.state.theme} onClick={()=> this.fileNameHandler('homeLibrary')}>Root Folder</button>
      <button className={'darkThemeButton'+this.state.theme} onClick={()=> this.darkThemeHandler()}>{this.state.darkTheme ? 'Dark Theme':'Light Theme'}</button>

      <ul className={'ulMain'+this.state.theme}> {this.state.pcListFiles.map((file, index)=>
        <li 
            className={this.fileType(file.Dir, file.Type)+this.state.theme +' liMain'+this.state.theme +' li'} 
            key={file.Name} 
            index={index} 
            onMouseEnter={this.handleHoverEnter} onMouseLeave={this.handleHoverLeave}
            onMouseMove={(e)=>this.mousePosition(e.pageX, e.pageY)} 
            onMouseOverCapture={()=>{this.handleHoverEnter(); this.folderPeek(index, this.fileType(file.Dir, file.Type))} }
            onClick={()=>{this.fileNameHandler(file)}}> {file.Name}
          
        </li>
        )}
      </ul>
      <div className={this.state.isHovered ? 'folderPeekBoxActiv': 'folderPeekBoxHidden'} style={{top:this.state.mouseLocationY+5, left:this.state.mouseLocationX+5 }}  >
        <ul className={'ulPeek'+this.state.theme}> {this.state.peek.map((file,index)=>
        <li className={'liPeek'+this.state.theme +" li"} 
        key={file.Name} 
        index={index} type={file.Type}> {file.Name} </li>
        )}
        </ul>
      </div>
    </div>
  );
  }
}

export default pcListData; 