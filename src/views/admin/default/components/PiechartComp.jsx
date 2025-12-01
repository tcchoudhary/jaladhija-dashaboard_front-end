import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import useUsageProfile from './UsageProfile';

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ days,ComplexId }) => {
  const { usageData, loading } = useUsageProfile(days,ComplexId);

  if (loading) return <div>Loading...</div>;
  if (!usageData || usageData.length === 0) return <div>No data available</div>;

  

  // ✅ Cabin name mapping: MUW => MUR
  const nameMap = {
    MWC: 'MWC',
    FWC: 'FWC',
    MUW: 'MUR', // mapping
    PWC: 'PWC',
  };

  // ✅ Initialize totals
  const totals = { MWC: 0, FWC: 0, MUR: 0, PWC: 0 };

  // ✅ Accumulate totals
  usageData.forEach((item) => {
    const rawName = item.cabin_name?.toUpperCase();
    const mappedName = nameMap[rawName];

    if (mappedName && totals.hasOwnProperty(mappedName)) {
      totals[mappedName] += item.total_entries;
    } else {
      console.warn(`⚠️ Unexpected cabin_name found: ${rawName}`);
    }
  });


  const data = {
    labels: ['MWC', 'FWC', 'MUR', 'PWC'],
    datasets: [
      {
        data: [totals.MWC, totals.FWC, totals.MUR, totals.PWC],
        backgroundColor: ['#00c853', '#00bfa5', '#00b0ff', '#d50000'],
        borderWidth: 0,
        cutout: '60%',
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '100%', height: '80%' }}>
        <Doughnut data={data} options={{ maintainAspectRatio: false }} />
      </div>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
        MWC: {totals.MWC} | FWC: {totals.FWC} | MUR: {totals.MUR} | PWC: {totals.PWC}
      </div>
    </div>
  );
};

export default GaugeChart;
