import React, { useState } from 'react';
import CanvasJSReact from '../assets/canvasJs/canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const BarChart = () => {

	const mainObj = {};
	const dataPoints = [];
	const dataPointsAvg = [];
	let fileReader;
	const [mainJson, setMainJson] = useState(false);

	const handleFileRead = e => {
		const content = fileReader.result;
		setMainJson(JSON.parse(content));
	}

	const handleselectedFile = (event) => {
		fileReader = new FileReader();
		fileReader.onloadend = handleFileRead;
		event.target.files.length && fileReader.readAsText(event.target.files[0])
	};

	const average = array => {
		const sum = array.reduce((val, accum) => {
			console.log({accum, val})
			return accum + val;
		})
		return sum/array.length;
	}

	mainJson && mainJson.spots && mainJson.spots.forEach(spot => {
		if(mainObj[spot.id]){
			mainObj[spot.id].push(spot.analysis[0].value)
		}else{
			mainObj[spot.id] = [spot.analysis[0].value]
		}
	});

	for(let spot in mainObj){
		const vals = mainObj[spot].length > 1 ? [Math.min(...mainObj[spot]), Math.max(...mainObj[spot])] : [0, mainObj[spot][0]]
		dataPoints.push({
			label: spot, y: vals
		})
	};

	for(let spot in mainObj){
		dataPointsAvg.push({
			label: spot, y: average(mainObj[spot])
		})
	}

	const options = {
		animationEnabled: true,
		theme: "light2",
		title:{
			text: "Some Title"
		},
		axisY:{
			title: "Values"
		},
		toolTip: {
			shared: true
		},
		data: [
		{
			type: "column",
			name: "Avg. Spot Value",
			toolTipContent: "<b>{label}</b> <br> <span style=\"color:#4F81BC\">{name}</span>: {y}",
			dataPoints: dataPointsAvg
		},
		{
			type: "error",
			name: "Variability Range",
			toolTipContent: "<span style=\"color:#C0504E\">{name}</span>: {y[0]} - {y[1]}",
			dataPoints: dataPoints
		}
		]
	}
	
	const preCode = mainJson && <div><h1>Formatted JSON</h1><pre style={{ width: '80%', marginLeft: 'auto', marginRight: "auto", backgroundColor: "black", textAlign: "left", fontFamily: "monospace", color: "springgreen" }}>{JSON.stringify(mainJson, null, 2)}</pre><h1>Formatted Grouped JSON</h1><pre style={{ width: '80%', marginLeft: 'auto', marginRight: "auto", backgroundColor: "black", textAlign: "left", fontFamily: "monospace", color: "springgreen" }}>{JSON.stringify(mainObj, null, 2)}</pre></div>
	return (
		<div>
			<h1>{ !mainJson ? 'Please Upload a .JSON file to see the Column Chart' : "" }</h1>
			<div>
				<input type="file" name="" accept=".json" id="" onChange={handleselectedFile} />
			</div>
			<br />
			<div style={{ padding: '5px' }}>{mainJson && <CanvasJSChart options = {options} />}</div>
			<br />
			{preCode}
			<br />
		</div>
	);
}

export default BarChart;