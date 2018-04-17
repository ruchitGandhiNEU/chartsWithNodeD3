const csv = require('csv');
const d3 = require('d3-node')().d3;
const output = require('d3node-output');
const d3nBar = require('d3node-barchart');
const d3nPie = require('d3node-piechart');
const {createFile} = require('./outputService');


exports.createBarChart = function (file, keys) {

    return new Promise((resolve, reject) => {
        //Parse Csv File
        csv.parse(file.buffer, function (err, data) {
            if (err) throw err;

            csv.stringify(data, function (err, stringData) {
                console.log(stringData);
                let d3parsedData = d3.csvParse(stringData, function (parsedData) {
                    //console.log(parsedData);
                    return {
                        key: parsedData[keys.xaxis],
                        value: parsedData[keys.yaxis]
                    };
                });
                createFile('./chartsOutput/barChart', d3nBar({data: d3parsedData})).then((htmlFile) => {
                    resolve(htmlFile);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
            });
        });
    });
};

exports.createPieChart = function (file,keys) {

    return new Promise((resolve, reject) =>{
        csv.parse(file.buffer, function(err, data){
            if (err) throw err;
            csv.stringify(data, function(err, stringData) {
                console.log(stringData);
                let d3parsedData = d3.csvParse(stringData, function (parsedData) {
                    return {
                        label: parsedData[keys.xaxis],
                        value: parsedData[keys.yaxis]
                    };
                });
                createFile('./chartsOutput/pieChart', d3nPie({data:d3parsedData})).then((htmlFile) => {
                    resolve(htmlFile);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });
            });
        });
    });
};