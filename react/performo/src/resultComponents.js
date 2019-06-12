import React, { Component } from 'react';
import settings from './settings.json';
import Moment from 'moment';

/**
 * Main component to display test results with heading and individual test details.
 * 
 * @author Faisal
 */
class ResultTable extends Component{
   render(){
      return(
         <div>
            {<GetResultJson />}
         </div>
      );
   }
}

/**
 * Component to get test result json from remote service and convert that json into output using Results component.
 * 
 * @see ShowResult
 * @see ErrorResult
 */
class GetResultJson extends Component{

   constructor() {
       super();

       this.state = {
           remoteJson: [], count : 0, success : true
       }
   }
   
  componentDidMount() {

      console.log("Getting json from service url: " + settings.serviceURL);
       
       fetch(settings.serviceURL)
                    .then(response => response.json())
           .then(response => this.setState({remoteJson: response})) // assigning response  json to component -> state.remoteJson
           .catch(function(response) {
            console.log('Inside the function');
            if (!response.ok) {
               alert("Unable to get response from " + settings.serviceURL);
            }
            return response;
      });

  }

  render(){
      
      var renderComponent;

      if ( this.state.success) 
         renderComponent =<ShowResult resultJson={this.state.remoteJson} />  
      else 
         renderComponent =<ErrorResult/>  

      return (
        <div>
            {renderComponent}
       </div>
       );
  }
}

/**
 * Component to render results in tabular form using provided json. 
 */
class ShowResult extends Component{

   render(){
    
    const {resultJson} = this.props; // assign prop.resultJson to local resultJson value
    
    Moment.locale('en');
    
      return(
          
         <div>
             <h3>Test Matrices</h3>
             <table width="60%">
                <tbody>
                     {
                        resultJson.map((testResult, i) => 
                            <tr>
                                <td>{i+1}. Results collected on {Moment(testResult.log_stamp).format('MM/DD/YYYY hh:mm:ss a')}<br/> 
                                    <table width="100%">
                                        <tbody>
                                            <tr><th>Test Unit</th><th>Duration (ms)</th></tr>
                                            {testResult.matrix.map((matrix, j) =>  
                                               <tr><td>{matrix.testUnitName}</td><td>{matrix.duration}</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            
                        )
                     }
                </tbody>
            </table>
         </div>
      );
   }
}

/**
 * Component to render output when response from server is not OK.
 */
class ErrorResult extends Component {

   render() {
      return (
         <div>
             <h3>Didn't get proper response from : {settings.serviceURL}</h3>
         </div>
      )
   }
}

export default ResultTable;