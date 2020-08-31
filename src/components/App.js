import React, { Component } from 'react';
import '../css/App.css';

import AddAppointment from './AddAppointment';
import ListAppointment from './ListAppointments';
import SearchAppointment from './SearchAppointments';
import { without, findIndex } from 'lodash';


class App extends Component {

  constructor() {
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      lastIndex: 0
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.AddAppointment = this.AddAppointment.bind(this);
   this.changeOrder = this.changeOrder.bind(this);
   this.searchApt = this.searchApt.bind(this);
   this.updateinfo = this.updateinfo.bind(this);}
   
AddAppointment(apt){
  let tempApts = this.state.myAppointments;
  apt.aptId = this.state.lastIndex;
  tempApts.unshift(apt);
  this.setState({
    myAppointments: tempApts,
    lastIndex: this.state.lastIndex+1
  });
}
  deleteAppointment(apt){
    let tempApts = this.state.myAppointments;
    tempApts= without(tempApts,apt); // returns array without apt data

    this.setState ({
      myAppointments:tempApts  // seting new data to state
    }); 
  }
  toggleForm(){
    this.setState({
      formDisplay: !this.state.formDisplay   
    });
  }

  componentDidMount() {
    fetch('./data.json')
      .then(respose => respose.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({lastIndex: this.state.lastIndex+1})
          return item;
        })
        this.setState({
          myAppointments: apts
        });
      });

  }

  updateinfo(name,value,id){
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments,{
      aptId: id
    });
    tempApts[aptIndex][name] = value;
    this.setState ({
      myAppointments: tempApts
    })
  }

  searchApt(query){
    this.setState({queryText:query});
  }
  changeOrder(order, dir){
    this.setState({
      orderBy: order,
      orderDir: dir
    });

  }
  render() {

    let order;
    let filterApts = this.state.myAppointments;
    if(this.state.orderDir === 'asc'){
      order = 1;
    }else{
      order = -1;
    }
    
    filterApts = filterApts.sort((a,b)=>{

    if(a[this.state.orderBy].toLowerCase()<b[this.state.orderBy].toLowerCase()){
      return -1 * order;
    }else{
      return 1* order;
    }

    }).filter(eachItem =>{
      return(
        eachItem['petName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase())
        
      );

    });
            return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg white">
              <div className="container">
                
                <AddAppointment 
                formDisplay={this.state.formDisplay}
                toggleForm={this.toggleForm}
                AddAppointment={this.AddAppointment}
                />

                <SearchAppointment
                orderBy = {this.state.orderBy}
                orderDir={this.state.orderDir}
                changeOrder = {this.changeOrder} 
                searchApt = {this.searchApt}
                />
                <ListAppointment appointments={filterApts}
                deleteAppointment={this.deleteAppointment}
                updateinfo={this.updateinfo}
                />

              </div>
            </div>
          </div>
        </div>


      </main>
    );

  }
}
export default App;