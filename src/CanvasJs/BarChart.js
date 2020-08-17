import React, { useState } from 'react';
import CanvasJSReact from '../assets/canvasJs/canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const BarChart = () => {

	const mainObj = {};
	const dataPoints = [];
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
	}

	const options = {
		theme: "dark2",
		exportEnabled: true,
		animationEnabled: true,
		title:{
			text: ""
		},
		axisX: {
			title: "Spot Titles",
			reversed: true,
		},
		axisY: {
			title: "Spot Analysis Values",
			suffix: ""
		},
		data: [{
			type: "rangeColumn",
			indexLabel: "{y[#index]}°",
			xValueFormatString: "Min Max",
			toolTipContent: "<strong>{x}</strong></br> Max: {y[1]}<br/> Min: {y[0]}",
			dataPoints: dataPoints
		}]
	}
	
	const preCode = mainJson && <div><h1>Formatted JSON</h1><pre style={{ width: '80%', marginLeft: 'auto', marginRight: "auto", backgroundColor: "black", textAlign: "left", fontFamily: "monospace", color: "springgreen" }}>{JSON.stringify(mainJson, null, 2)}</pre></div>
	return (
		<div>
			<h1>Please Upload a .JSON file to see the Column Chart</h1>
			<div>
				<input type="file" name="" accept=".json" id="" onChange={handleselectedFile} />
			</div>
			<br />
			{mainJson && <CanvasJSChart options = {options} />}
			<br />
			{preCode}
			<br />
		</div>
	);
}

export default BarChart;