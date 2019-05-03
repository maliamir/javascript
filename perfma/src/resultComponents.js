import React, { Component } from 'react';
import settings from './settings.json';

/**
 * Main component to display test results with heading and individual test details.
 * 
 * @author Faisal
 */
class ResultTable extends Component{
   render(){
      return(
         <div>
            <h2>Remote Json Rendering</h2>
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

      return(
          
         <div>
             <h3 >Test Result Data</h3>
             <table width="60%"><tbody>
                 <tr><th>Test Scenario</th><th>Execution Time(ms)</th></tr>
                 <tr className="alt"><td>Sample Test1</td><td>300</td></tr>
                 <tr><td>Sample Test2</td><td>600</td></tr>
             {resultJson.map((testResult, index)=>{
                 return <tr><td>{testResult.testName}</td><td>{testResult.executionTime}</td></tr>
             })
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