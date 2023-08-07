import React, { useState } from 'react';


function GS() {
  const [data, setData] = useState({
    totalElectricityConsumption: 0,
    renewableEnergyConsumption: 0,
    gridAvgEmissionsFactor: 0,
    spDataStorageCapacity: 0,
    totalNetworkElectricityConsumption: 0,
    totalNetworkRenewableEnergyConsumption: 0,
    avgGridEmissionsFactor: 0,
    totalNetworkDataStorageCapacity: 0,
    renewableEnergyProducedOnSite: 0,
    gridMarginalEmissionsFactor: 0,
    totalNetworkRenewableEnergyProduction: 0,
    marginalGridEmissionsFactorGlobalAvg: 0,
    confidenceScore: 0,
  });

const [expandedCard, setExpandedCard] = useState(null);

const toggleCard = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

//removes any commas in the input string & parses the string without commas
const handleInputChange = (event) => {
    const valueWithoutCommas = event.target.value.replace(/,/g, ''); 
    setData({
        ...data,
        [event.target.name]: parseFloat(valueWithoutCommas),
    });
};

//format results to support commas & decimals
const formatNumber = (number) => number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//step1 - SP Scope 2 Emissions
const [scope2, setScope2] = useState(0);

const calculateScope2 = () => {
    return (data.totalElectricityConsumption - data.renewableEnergyConsumption) * data.gridAvgEmissionsFactor;
  };

  const spTotalScope2Emissions = () => {
    const result = calculateScope2() / 1000;
    setScope2(result);  
};

//step2 - SP Emissions Intensity
const [emissionsIntensity, setEmissionsIntensity] = useState(0);

const calculateEmissionsIntensity = () => {
    if(scope2 && data.spDataStorageCapacity){
      const result = scope2 / data.spDataStorageCapacity;
      setEmissionsIntensity(result);
    }
};

//step3 - Network Scope 2 emissions
const [networkScope2, setNetworkScope2] = useState(0);

const calculateNetworkScope2 = () => {
    const result = (data.totalNetworkElectricityConsumption - data.totalNetworkRenewableEnergyConsumption) * data.avgGridEmissionsFactor;
    setNetworkScope2(result / 1000);  // converts gCO2e to kgCO2e
};

//step4 - Network Emissions Intensity
const [networkEmissionsIntensity, setNetworkEmissionsIntensity] = useState(0);

const calculateNetworkEmissionsIntensity = () => {
    if(networkScope2 && data.totalNetworkDataStorageCapacity){
      const result = networkScope2 / data.totalNetworkDataStorageCapacity;
      setNetworkEmissionsIntensity(result);
    }
};

//step5 - Emissions Score
const [emissionsScore, setEmissionsScore] = useState(0);

const calculateEmissionsScore = () => {
    if (networkEmissionsIntensity && emissionsIntensity) {
        const normalizedEmissionsIntensity = ((networkEmissionsIntensity - emissionsIntensity) / networkEmissionsIntensity);
        setEmissionsScore(normalizedEmissionsIntensity);
    }
};

//step6 - SP Marginal Emissions
const [spMargEmissions, setSpMargEmissions] = useState(0);

const spMarginalEmissions = () => {
    const result = ( (data.totalElectricityConsumption - data.renewableEnergyProducedOnSite) * data.gridMarginalEmissionsFactor) / 1000;
    setSpMargEmissions(result);
};

//step7 - SP Marginal Emissions Intensity
const [spMargEmissionsIntensity, setSpMargEmissionsIntensity] = useState(0);

const calculateSpMarginalEmissionsIntensity = () => {
    if (spMargEmissions && data.spDataStorageCapacity) {
        const result = spMargEmissions / data.spDataStorageCapacity;
        setSpMargEmissionsIntensity(result);
    }
};

//step8 - Network Marginal Emissions
const [networkMarginalEmissions, setNetworkMarginalEmissions] = useState(0);

const calculateNetworkMarginalEmissions = () => {
    const result = (data.totalNetworkElectricityConsumption - data.totalNetworkRenewableEnergyProduction) * data.marginalGridEmissionsFactorGlobalAvg;
    setNetworkMarginalEmissions(result / 1000);  // converts gCO2e to kgCO2e
};

//step9 - Benchmark Emissions Intensity
const [benchmarkEmissionsIntensity, setBenchmarkEmissionsIntensity] = useState(0);

const calculateBenchmarkEmissionsIntensity = () => {
    if (isNaN(data.networkMarginalEmissions) || isNaN(data.totalNetworkDataStorageCapacity) || data.totalNetworkDataStorageCapacity === 0) {
        console.error("Invalid values detected:", data.networkMarginalEmissions, data.totalNetworkDataStorageCapacity);
        return;
    }
    const intensity = data.networkMarginalEmissions / data.totalNetworkDataStorageCapacity;
    setBenchmarkEmissionsIntensity(intensity); 
};

//step10 - Location Score
const [locationScore, setLocationScore] = useState(0);

const calculateLocationScore = () => {
    if (benchmarkEmissionsIntensity && spMargEmissionsIntensity) {
      const score = ((benchmarkEmissionsIntensity - spMargEmissionsIntensity) / benchmarkEmissionsIntensity);
      setLocationScore(score);
    }
  };

//step 11 Confidence Score
const [confidenceScore, setConfidenceScore] = useState(0);

const calculateConfidenceScore = () => {
    const result = (data.confidenceScore / 10);
    setConfidenceScore(result);
};

//step12 Green Scoore
const [greenScore, setGreenScore] = useState(0);

const calculateGreenScore = () => {
    const result = ((emissionsScore)*(locationScore)*(confidenceScore)) * 100;
    setGreenScore(result);
  };

  return (
    <div className='App-header'>
    <div className='App-text'>
      <h1>Calculate Your Green Score</h1>

    <div className='steps'>
    <p>1. <b>SP Total Scope 2 Emissions</b></p>
    <p><span className='button' onClick={() => toggleCard(1)}> Click for details...</span></p>
        {expandedCard === 1 && (
         <>
      <p>The total emissions of an SP are calculated by subtracting the renewable energy consumption from the total electricity consumption and then multiplying the result by a grid emissions factor. The result represents the non-renewable energy-related emissions of the SP​. This is the “slice of the global emissions pie” owned by this SP.</p>
      <p>Formula: SP Total Scope 2 Emissions = (Total Electricity Consumption - Renewable Energy Consumption) * Grid Average Emissions Factor</p>
      <input className='box' name="totalElectricityConsumption" onChange={handleInputChange} placeholder="Total Electricity Consumption (in kWh)..." />
      <input  className='box' name="renewableEnergyConsumption" onChange={handleInputChange} placeholder="Renewable Energy Consumption (in kWh)..." />
      <input className='box' name="gridAvgEmissionsFactor" onChange={handleInputChange} placeholder="Grid Average Emissions Factor (in gCO2/kWh)..." />
      <button onClick={spTotalScope2Emissions }>Calculate</button> 
      {scope2 !== null && <div>Your Scope 2 Emissions are: {formatNumber(scope2)} (kg CO2e)</div>}
        </>
        )}
    </div>

    <div className='steps'>
    <p>2. <b>Emissions Intensity</b></p>
    <p><span className='button' onClick={() => toggleCard(2)}><b> Details...</b></span></p>
        {expandedCard === 2 && (
         <>
      <p>The emissions intensity is determined by dividing the Scope 2 emissions (calculated in step 1) by the data storage capacity of the SP. This provides a measure of the emissions produced per unit of data stored, allowing for a comparison of the emissions efficiency between different SPs​.</p>
      <p> Formula: Emissions Intensity = Total Scope 2 Emissions / SP Average Data Storage Capacity over Reporting Time Period (PiB)</p>
      <input className='box' name="spDataStorageCapacity" onChange={handleInputChange} placeholder="SP Ave Storage Capacity (PiB)..." />
      <button onClick={calculateEmissionsIntensity}>Calculate</button>
      {emissionsIntensity !== null && <div>Your Emissions Intensity is: {formatNumber(emissionsIntensity)} (kg CO2e/PiB)</div>}
      </>
        )}
    </div>

    <div className='steps'>
    <p onClick={() => toggleCard(3)}>3. <b>Network Scope 2 Emissions</b>:<span className='button'><b> Details...</b></span></p>
        {expandedCard === 3 && (
         <>
        <p>The total emissions across the entire network are determined by subtracting the total network renewable energy consumption from the total network electricity consumption and then multiplying the result by an average grid emissions factor. This provides a measure of the total non-renewable energy-related emissions across the network​. This is the “slice of the global emissions pie” owned by the Filecoin network.</p>
        <p>Formula: Network Total Scope 2 Emissions = (Total Network Electricity Consumption - Total Network Renewable Energy Consumption) * Average Grid Emissions Factor</p>
        <input className='box' name="totalNetworkElectricityConsumption" onChange={handleInputChange} placeholder="Total Network Electricity Consumption (in kWh)..." />
        <input className='box' name="totalNetworkRenewableEnergyConsumption" onChange={handleInputChange} placeholder="Total Network Renewable Energy Consumption (in kWh)..." />
        <input className='box' name="avgGridEmissionsFactor" onChange={handleInputChange} placeholder="Global Grid Average Emissions Factor (in gCO2/kWh)..." />
        <button onClick={calculateNetworkScope2}>Calculate</button>
        {networkScope2 !== null && <div>The Network's Scope 2 Emissions are: {formatNumber(networkScope2)} (kg CO2e)</div>}
        </>
        )}
    </div>

    <div className='steps'>
    <p onClick={() => toggleCard(4)}>4. <b>Benchmark Network Emissions Intensity</b>:<span className='button'><b> Details...</b></span></p>
        {expandedCard === 4 && (
         <>
        <p>The emissions intensity for the network as a whole is determined by dividing the total network Scope 2 emissions (calculated in step 3) by the total network data storage capacity. This provides a measure of the emissions produced per unit of data stored across the entire network, serving as a benchmark for comparing individual SPs​.</p>
        <p>Formula: Benchmark Emissions Intensity = Network Total Scope 2 Emissions / Total Network Data Storage Capacity</p>
        <input className='box' name="totalNetworkDataStorageCapacity" onChange={handleInputChange} placeholder="Total Network Data Storage Capacity..." />
        <button onClick={calculateNetworkEmissionsIntensity}>Calculate</button>
        {networkEmissionsIntensity !== null && <div>The Network's Emissions Intensity is: {formatNumber(networkEmissionsIntensity)} (kg CO2e/PiB)</div>}
        </>
        )}
    </div>

    <div className='steps'>
    <p onClick={() => toggleCard(5)}>5. <b>Emissions Score</b></p>
    <p><span className='button'> Details...</span></p>
        {expandedCard === 5 && (
         <>
        <p> The Emissions Score (Normalized Emissions Intensity) calculation normalizes the emissions intensity of an individual SP by subtracting the SP's emissions intensity from the benchmark emissions intensity and then dividing the result by the benchmark emissions intensity. This provides a measure of how an individual SP's emissions efficiency compares to the network average​.</p>
        <p>Formula: Normalized Emissions Intensity = ((Benchmark Emissions Intensity - SP's Emissions Intensity) / Benchmark Emissions Intensity)</p>
        <input className='box' name="spEmissionsIntensity" onChange={handleInputChange} placeholder={formatNumber(emissionsIntensity)} />
        <button onClick={calculateEmissionsScore}>Calculate</button>
        {emissionsScore !== null && <div>Your Emissions Score is: {formatNumber(emissionsScore)} (kg CO2e/PiB)</div>}
        </>
        )}
    </div>

    <div className='steps'>
    <p onClick={() => toggleCard(6)}>6. <b>SP Marginal Emissions Score</b><span className='button'> Details...</span></p>
        {expandedCard === 6 && (
         <>
        <p> This is the “effect of the SP on local power grid emissions”; a measurement of how having a load at that grid location affects how the power grid functions.</p>
        <p>Formula: SP Marginal Emissions = (Total Electricity Consumption - Renewable Energy Produced On Site) * Grid Marginal Emissions Factor</p>
        <input className='box' name="renewableEnergyProducedOnSite" onChange={handleInputChange} placeholder="Renewable Energy Produced On Site (in kWh)..." />
        <input className='box' name="gridMarginalEmissionsFactor" onChange={handleInputChange} placeholder="SP Marginal Emissions Factor (in gCO2/kWh)..." />
        <button onClick={spMarginalEmissions}>Calculate</button>
        {spMargEmissions !== null && <div>SP Marginal Emissions: {formatNumber(spMargEmissions)} (kg CO2e)</div>}
        </>
        )}
    </div>

    <div className='steps'>
    <p onClick={() => toggleCard(7)}>7. <b>SP Marginal Emissions Intensity</b><span className='button'> Details...</span></p>
        {expandedCard === 7 && (
         <>
        <p> The marginal emissions intensity is determined by dividing the SPs Marginal Emissions (calculated in step 6) by the data storage capacity of the SP. This provides a measure of the marginal emissions produced per unit of data stored, allowing for a comparison of the marginal emissions efficiency between different SPs​.</p>
        <p>Formula: SP Marginal Emissions / SP Data Storage Capacity</p>
        <input className='box' name="spDataStorageCapacity" onChange={handleInputChange} placeholder="SP's Data Storage Capacity..." />
        <button onClick={calculateSpMarginalEmissionsIntensity}>Calculate</button>
        {spMargEmissionsIntensity !== null && <div>SP Marginal Emissions Intensity: {formatNumber(spMargEmissionsIntensity)} (kg CO2e/PiB)</div>}
        </>
        )}
    </div>

    <div className='steps'>
    <p onClick={() => toggleCard(8)}>8. <b>Network Marginal Emissions</b><span className='button'> Details...</span></p>
        {expandedCard === 8 && (
         <>
        <p> The total marginal emissions across the entire network are determined by subtracting the total network renewable energy production from the total network electricity consumption and then multiplying the result by a global average marginal emissions factor. This provides a measure of the total non-renewable energy-related marginal emissions across the network​.</p>
        <p>Formula: (Total Network Electricity Consumption - Total Network Renewable Energy Production) * Marginal Grid Emissions Factor, Global Average</p>
        <input className='box' name="totalNetworkRenewableEnergyProduction" onChange={handleInputChange} placeholder="Total Network Renewable Energy Production (in kWh)..." />
        <input className='box' name="marginalGridEmissionsFactorGlobalAvg" onChange={handleInputChange} placeholder="Marginal Grid Emissions Factor, Global Average (in gCO2/kWh)..." />
        <button onClick={calculateNetworkMarginalEmissions}>Calculate</button>
        {networkMarginalEmissions !== null && <div>The Network's Marginal Emissions are: {formatNumber(networkMarginalEmissions)} (kg CO2e)</div>}
        </>
        )}
    </div>

    <div className='steps'>
        <p onClick={() => toggleCard(9)}>9. <b>Network Marginal Emissions Intensity</b><span className='button'> Details...</span></p>
        {expandedCard === 9 && (
         <>
        <p> Determine the marginal emissions intensity for the network by dividing the total network marginal emissions by the total network data storage capacity. This provides a measure of the marginal emissions produced per unit of data stored across the entire network​.</p>
        <p>Formula: Network Marginal Emissions / Network Storage Capacity</p>
        <input className='box' name="totalNetworkDataStorageCapacity" onChange={handleInputChange} placeholder="Network Storage Capacity (in PiB)..." />
        <input className='box' name="networkMarginalEmissions" onChange={handleInputChange} placeholder={formatNumber(networkMarginalEmissions)} />
        <button onClick={calculateBenchmarkEmissionsIntensity}>Calculate</button>
        {benchmarkEmissionsIntensity !== null && <div>The Benchmark Marginal Network Emissions Intensity is: {formatNumber(benchmarkEmissionsIntensity)} (kgCO2/PiB)</div>}
        </>
        )}
    </div>

    <div className='steps'>
        <p onClick={() => toggleCard(10)}>10. <b>Location Score</b><span className='button'> Details...</span></p>
        {expandedCard === 10 && (
         <>
        <p> The Location Score (Normalized Marginal Emissions Intensity) calculation normalizes the marginal emissions intensity of an individual SP by subtracting the SP's marginal emissions intensity from the benchmark marginal emissions intensity and then dividing the result by the benchmark marginal emissions intensity. This provides a measure of how an individual SP's marginal emissions efficiency compares to the network average​.</p>
        <p>Formula: 1 - ((Benchmark Marginal Network Emissions Intensity - SP Marginal Network Emissions Intensity) / (Benchmark Marginal Network Emissions Intensity))</p>
        <button onClick={calculateLocationScore}>Calculate</button>
        {locationScore !== null && <div>Your Location Score is: {formatNumber(locationScore)}</div>}
        </>
        )}
    </div>


    <div className='steps'>
        <p onClick={() => toggleCard(11)}>11. <b>Confidence Score</b><span className='button'> Details...</span></p>
        {expandedCard === 11 && (
         <>
        <p> This score is assigned based on certain qualifying criteria from the SP Confidence Scoring Matrix. These criteria likely pertain to the reliability or quality of the SP's data or performance​.</p>
        <p>Formula: An overview of the Confidence Scoring Matrix is provided below: Green Scores Methodology</p>
        <input className='box' name="confidenceScore" onChange={handleInputChange} placeholder="Enter Confidence Score..." />
        <button onClick={calculateConfidenceScore}>Calculate</button>
        {confidenceScore !== null && <div>Your Confidence Score is: {formatNumber(confidenceScore)}</div>}
        </>
        )}
    </div>

    <div className='steps'>
        <p onClick={() => toggleCard(12)}>12. <b>Green Score</b><span className='button'> Details...</span></p>
        {expandedCard === 12 && (
         <>
        <p> The Green Score is calculated by multiplying the Confidence Score by the “slice of the global emissions pie” (Emissions Score), and the measure of how an individual SP's marginal emissions efficiency compares to the network average​ (Location Score), and then multiplying the result by 100. This results in a score ranging from 0 to 100, and provides a measure of the SP's environmental performance, with higher scores indicating better performance​.</p>
        <p>Formula: Green Score = Confidence Score * (Emissions Score) * (Location Score)  * 100</p>
        <button onClick={calculateGreenScore}>Calculate Green Score</button>
        {greenScore !== null && <div>Your Green Score is: {formatNumber(greenScore)} </div>}
        </>
        )}
    </div> 
    </div>
    </div>
  );
}

export default GS;