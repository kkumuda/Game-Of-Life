import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ButtonToolbar,MenuItem,DropdownButton } from 'react-bootstrap';



class Box extends React.Component{

  selectbox=()=>{
    this.props.selectbox(this.props.row,this.props.col);
  }

  render(){
    return(
      <div 
      className={this.props.boxclass}
      id={this.props.id}
      onClick={this.selectbox} 

      />
    );
  }
}


class Grid extends React.Component{
  render(){
    const width=(this.props.cols*14);
    var rowsarr=[];

    var boxclass="";
    for (var i=0;i<this.props.rows;i++){
      for(var j=0;j<this.props.cols;j++){
        let boxid=i+"_"+j;
        boxclass=this.props.gridfull[i][j]?"box on":"box off";
        rowsarr.push(
          <Box 
          boxclass={boxclass}
          key={boxid}
          boxid={boxid}
          row={i}
          col={j}
          selectbox={this.props.selectbox}

          />
        );
      }
    }
    return(
      <div className='grid' style={{width:width}}>
      {rowsarr}
        
      </div>
    );
  }
}


//Bootstrap to stylize the buttons
class Buttons extends React.Component{

  handleSelect=(evt)=>{
    this.props.gridSize(evt);
  }
  render(){
    return(
      <div className='center'>
        <ButtonToolbar>
          <button className='btn btn-default' onClick={this.props.playbutton}>Play</button>
          <button className='btn btn-default' onClick={this.props.pausebutton}>Pause</button>
          <button className='btn btn-default' onClick={this.props.clear}>Clear</button>
          <button className='btn btn-default' onClick={this.props.slow}>Slow</button>
          <button className='btn btn-default' onClick={this.props.fast}>Fast</button>
          <button className='btn btn-default' onClick={this.props.seed}>Seed</button>

          <DropdownButton
          title="Grid Size"
          id="size-menu"
          onSelect={this.handleSelect}
          >
            <MenuItem eventKey="1">20x10</MenuItem>
            <MenuItem eventKey="2">50x30</MenuItem>
            <MenuItem eventKey="3">70x50</MenuItem>


          </DropdownButton>
        </ButtonToolbar>
      </div>
    )
  }
}



class Main extends React.Component{
  constructor(){
    super();
    this.speed=100;
    this.rows=30;
    this.cols=50;

    this.state={
      generation:0,
      gridfull:Array(this.rows).fill().map(()=>Array(this.cols).fill(false))
    }
  }

  selectbox=(row,col)=>{
    let gridcopy=arrayClone(this.state.gridfull);
    gridcopy[row][col]=!gridcopy[row][col]; //update the cell to opposite state
    //set gridcopy as new state
    this.setState({
      gridfull:gridcopy
    });
  }

  //random starting cells 
  seed =()=>{
    let gridcopy=arrayClone(this.state.gridfull);
    //go through every square of grid and decide to turn on or off
    for(let i=0;i<this.rows;i++){
      for(let j=0;j<this.cols;j++){
        //creating random number between 0-4 and if it equals 1 then (25% chance) 
        if(Math.floor(Math.random()*4)===1){
          gridcopy[i][j]=true;
        }
      }
    }
    this.setState({
      gridfull:gridcopy
    });
  }


playbutton =()=>{

  clearInterval(this.intervalid) //clears timer set by setInterval
  this.intervalid=setInterval(this.play,this.speed); //calls this.play at every speed seconds
}


slow=()=>{
  this.speed=500;
  this.playbutton();
}

fast=()=>{
  this.speed=100;
  this.playbutton();
}

clear=()=>{
  var grid=Array(this.rows).fill().map(()=>Array(this.cols).fill(false));
  this.setState({
    gridfull:grid,
    generation:0
  });
}


gridSize=(size)=>{
  switch(size){
    case "1":
      this.cols=20;
      this.rows=10;
    break;
    case "2":
      this.cols=50;
      this.rows=30;    
    break;
    default:  
      this.cols=70;
      this.rows=50;
  }
this.clear();
}

pausebutton=()=>{
  clearInterval(this.intervalid);
}

play=()=>{
  //check what grid is currently like
  let g=this.state.gridfull;
  //change sqaures on clone
  let g2=arrayClone(this.state.gridfull);

  for(let i=0;i<this.rows;i++){
    for (let j=0;j<this.cols;j++){
      let count=0; //no of neighbours
      //if tehres a neighbour increase the count
      //
      if(i>0 &&j>0) if(g[i-1][j-1]) count++;

      if(i>0) if(g[i-1][j])  count++;
      if(i>0 && j<this.cols-1) if(g[i-1][j+1]) count++;
      if(j<this.cols-1) if(g[i][j+1]) count++;
      if(j>0) if(g[i][j-1])  count++;
      if(i<this.rows-1 && j>0) if(g[i+1][j-1]) count++;
      if(i<this.rows-1 && j<this.cols-1) if(g[i+1][j+1]) count++;

      if(i<this.rows-1) if(g[i+1][j]) count++;

      //any cell with <2 or >3 neighbours dies
      if(g[i][j] && (count<2||count>3)) g2[i][j]=false;

      //if cell is dead but has 3 neighbours it comes alive
      if(!g[i][j] && count===3) g2[i][j]=true;
    }
  }
  this.setState({
    gridfull:g2,
    generation:this.state.generation+1
  });
}
  
//lifecycle hook for something that should happen right away something is loaded
componentDidMount(){
  this.seed();
  this.playbutton();
}




  render(){
    return(
      <div>
        <h1>The Game Of Life</h1>
        <Buttons
        playbutton={this.playbutton}
        pausebutton={this.pausebutton}
        slow={this.slow}
        fast={this.fast}
        clear={this.clear}
        seed={this.seed}
        gridSize={this.gridSize}
        />

        <Grid
        gridfull={this.state.gridfull}
        rows={this.rows}
        cols={this.cols}
        selectbox={this.selectbox}

           />
        <h2>Generations: {this.state.generation}</h2>

      </div>
    );
  }
}

function arrayClone(arr){
  return JSON.parse(JSON.stringify(arr)); //we are making a deep clone as it is a nested array
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Main />
);


   