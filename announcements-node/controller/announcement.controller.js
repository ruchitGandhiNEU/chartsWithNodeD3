const announcementService = require('../service/announcement.service');
//const parseTime = d3.timeParse('%d-%b-%y');


exports.createBarChart = async function (req, res) {
    if (req.file && req.body.barChartKeys) {

        try {
            let chartData = await announcementService.createBarChart(req.file, JSON.parse(req.body.barChartKeys));

            res.status(200).send({
                success: true,
                payload: chartData,
                message: "Bar Chart created",
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Something went wrong",
            })
        }

    } else {
        res.status(400).send({
            success: false,
            message: "Not enough data provided",
        })
    }
};


    exports.createPieChart = async function (req, res) {
        console.log("xyz");
        if (req.file && req.body.pieChartKeys) {
            let htmlFile = await announcementService.createPieChart(req.file, JSON.parse(req.body.pieChartKeys));
            res.status(200).send({
                success: true,
                payload: htmlFile,
                message: "Chart created",
            })

        } else {
            res.status(400).send({
                success: false,
                message: "Incorrect data provided",
            })
        }
    };

    exports.createLineChart = async function (req, res) {
        if (req.file && req.body.lineChartKeys) {
            let htmlFile = await announcementService.createLineChart(req.file, JSON.parse(req.body.lineChartKeys));
            res.status(200).send({
                success: true,
                payload: htmlFile,
                message: "Chart created",
            })

        } else {
            res.status(400).send({
                success: false,
                message: "Incorrect data provided",
            })
        }
    };

// exports.createLineChart = function (req, res) {
//     console.log("File", req.file);
//     csv.parse(req.file.buffer, function(err, data){
//         if (err) throw err;
//         csv.stringify(data, function(err, data1){
//             console.log(data1);
//             let test = d3.tsvParse(data1, function(d) {
//                 return {
//                     key: parseTime(d.date),
//                     value: +d.close
//                 };
//             });
//             console.log(test);
//             output('./output', d3nLine({ data: test }));
//         });
//     });
// };