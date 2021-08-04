import React, { useState } from "react";
function Child1(props) {
  return (
    <>
      {props.vara}
      <button
        onClick={() => {
          props.setvara("child1");
        }}
      >
        Child1
      </button>
    </>
  );
}
function Child2(props) {
  const [var2, setvar2] = useState('default2')
    return (
    <>
    {var2}
    <button onClick={()=>setvar2('changed')}>child2</button>
      <Child3 vara={props.vara} setvara={props.setvara}/>
    </>
  );
}
function Child3(props) {
  return (
    <>
      <button
        onClick={() => {
          props.setvara(props.vara+"child3");
        }}
      >
        Child3
      </button>
    </>
  );
}
class Parent extends React.Component{
    constructor(props){
        super(props)
        this.state={
            vara:'default'
        }
    }
    componentDidMount(){
        console.log('mount')
    }
    componentDidUpdate(){
        console.log('update');
    }
    render(){
        return (
            <>
              {this.props.showNav}
              <button
                onClick={() => {
                  this.props.setshowNav(2);
                }}
              >
                Parent
              </button>
              <Child1 vara={this.state.vara} setvara={(val)=>this.setState({vara:val})} />
              <Child2 vara={this.state.vara} setvara={(val)=>this.setState({vara:val})} />
            </>
          );
    }
}
function Parent2(props) {
  const [vara, setvara] = useState("Default");
  return (
    <>
      {props.showNav}
      <button
        onClick={() => {
          props.setshowNav(2);
        }}
      >
        Parent
      </button>
      <Child1 vara={vara} setvara={setvara} />
      <Child2 vara={vara} setvara={setvara} />
    </>
  );
}

export default Parent;
