// import React from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import useFeedback from './feedback';
// import { MdStar } from 'react-icons/md'; // Material Design Star icon

// ChartJS.register(ArcElement, Tooltip, Legend);

// const GaugeChart = ({ days }) => {
//   const { feedbackData, loadding } = useFeedback(days);
//   console.log(feedbackData, 'feedback')
//   if (loadding) return <div>Loading...</div>;
//   if (!feedbackData || feedbackData.length === 0)
//     return <div>No data available</div>;

//   // ✅ Step 1: Group by cabin type (MWC, FWC, etc.)
//   const feedbackMap = {};

//   feedbackData.forEach((item) => {
//     const cabinName = item.cabin?.cabin_name || 'Unknown';
//     const feedback = parseFloat(item.AverageFeedback || 0);

//     if (!feedbackMap[cabinName]) {
//       feedbackMap[cabinName] = { total: 0, count: 0 };
//     }

//     feedbackMap[cabinName].total += feedback;
//     feedbackMap[cabinName].count += 1;
//   });

//   // ✅ Step 2: Prepare chart data
//   const labels = [];
//   const dataValues = [];

//   Object.entries(feedbackMap).forEach(([cabinType, { total, count }]) => {
//     labels.push(cabinType);
//     let avg = total / count;

//     // Adjust the average feedback if it's less than 3
//     if (avg < 3) {
//       avg = 3.5;
//     }

//     dataValues.push(avg.toFixed(1)); // Format to 1 decimal place
//   });

//   const data = {
//     labels,
//     datasets: [
//       {
//         data: dataValues,
//         backgroundColor: [
//           '#00c853', // MWC
//           '#00bfa5', // FWC
//           '#00b0ff', // MUW / MUR
//           '#d50000', // PWC
//           '#ff9100',
//           '#7e57c2',
//           '#42a5f5',
//         ],
//         borderWidth: 0,
//         cutout: '60%',
//         circumference: 180,
//         rotation: 270,
//       },
//     ],
//   };

//   return (
//     <div style={{ width: '100%', height: '100%' }}>
//       <div style={{ width: '100%', height: '80%' }}>
//         <Doughnut data={data} options={{ maintainAspectRatio: false }} />
//       </div>
//       <div
//         style={{
//           textAlign: 'center',
//           fontWeight: 'bold',
//           marginTop: '10px',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           // flexDirection: 'column',
//         }}
//       >
//         {labels.map((label, index) => (
//           <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//             {label}: {dataValues[index]} <MdStar color="#ff00ffff" size={22} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GaugeChart;




import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import useFeedback from './feedback';
import { MdStar } from 'react-icons/md'; // Material Design Star icon

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ days }) => {
  const { feedbackData, loadding } = useFeedback(days);
  console.log(feedbackData, 'feedback');

  if (loadding) return <div>Loading...</div>;
  if (!feedbackData || feedbackData.length === 0)
    return <div>No data available</div>;

  // ✅ Group by cabin (MWC, FWC, etc.)
  const feedbackMap = {};

  feedbackData.forEach((item) => {
    // cabin ka naam safely nikal lo
    const cabinName =
      item.cabin?.cabin_name ||
      item.cabin_name ||
      `Cabin ${item.cabin_id || ''}`;

    const raw = item.AverageFeedback;

    // null / undefined / empty / "null" waale feedback skip
    if (
      raw === null ||
      raw === undefined ||
      raw === '' ||
      raw === 'null'
    ) {
      return;
    }

    const feedback = parseFloat(raw);
    if (isNaN(feedback)) return; // invalid number to skip

    if (!feedbackMap[cabinName]) {
      feedbackMap[cabinName] = { total: 0, count: 0 };
    }

    feedbackMap[cabinName].total += feedback;
    feedbackMap[cabinName].count += 1;
  });

  const labels = [];
  const dataValues = [];

  Object.entries(feedbackMap).forEach(([cabinType, { total, count }]) => {
    if (!count) return;

    const avg = total / count; // ✅ actual avg, no forcing
    labels.push(cabinType);
    dataValues.push(Number(avg.toFixed(1))); // Chart.js ko number dena better hai
  });

  // agar sab feedback null the / skip ho gaye
  if (labels.length === 0) {
    return <div>No valid feedback found</div>;
  }

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          '#00c853',
          '#00bfa5',
          '#00b0ff',
          '#d50000',
          '#ff9100',
          '#7e57c2',
          '#42a5f5',
        ],
        borderWidth: 0,
        cutout: '60%',
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // neeche custom legend bana rahe ho
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw ?? '';
            return `${label}: ${value} ⭐`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '100%', height: '80%' }}>
        <Doughnut data={data} options={options} />
      </div>

      <div
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginTop: '10px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {labels.map((label, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #eee',
            }}
          >
            {label}: {dataValues[index]}
            <MdStar color="#ffbf00" size={18} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaugeChart;
