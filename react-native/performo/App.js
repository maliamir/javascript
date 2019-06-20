/**
 * React Native App to render Test Matrices
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import Moment from 'moment';

import settings from './settings.json';

function getTestMatrices() {
  return fetch(settings.serviceURL)
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}
       
type Props = {};
export default class App extends Component <Props> {

  state = {
    data: [],
    tableHead: ['Test Unit Name', 'Duration']
  };

  componentDidMount() {
    getTestMatrices().then(data => {
      this.setState({ data });
    });
  }

  render() {

    var matricesInfo = new Object();
    matricesInfo.tableHead = ['Test Unit Name', 'Duration (ms)'];
    matricesInfo.logStamps = [];
    matricesInfo.matrices = [];
    for (let d of this.state.data) {

      matricesInfo.logStamps.push(d.log_stamp);
      mInfo = [];
      for (let m of d.matrix) {
          tInfo = [];
          tInfo.push(m.testUnitName);
          tInfo.push(m.duration);
          mInfo.push(tInfo);
      }
      matricesInfo.matrices.push(mInfo);

    }

    return (
      
      <ScrollView>

        <Text style={styles.welcome}>Test Matrices</Text>

          {
            matricesInfo.logStamps.map((logStamp, i) => 

                <View key={"testMatrix-" + i} style={{align: 'center'}}>
                  
                  <Text key={i}>{"\n\t"}{i+1}. Results collected on {Moment(logStamp).format('MM/DD/YYYY hh:mm:ss a')}</Text>

                  <Table key={"tbl-" + i} borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}} style={{width: '95%'}}>
                      <Row data={matricesInfo.tableHead} key={"header-" + i}/>
                      {
                          matricesInfo.matrices[i].map((m, j) => <Row data={m} key={"data-" + i + "-" + j}/>)
                      }
                  </Table>

                </View>
            )
          }                

      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
  
});