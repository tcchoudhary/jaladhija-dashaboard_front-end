


// export function transformFeedbackDataToChart(data = [], groupBy = 'day') {
//   const result = {};
//   const rawDataLog = [];
//   const transformedDataLog = [];
//   // Iterate over each item in the data
//   data.forEach((item) => {
//     const cabinKey = item.cabin?.cabin_name?.toLowerCase(); // 'mwc', 'fwc', etc.
//     const feedback = parseFloat(item.AverageFeedback);

//     // Validate if feedback is a number
//     if (isNaN(feedback)) {
//       return; // Skip invalid feedback
//     }

//     // Ensure that cabinKey is valid
//     if (!['mwc', 'fwc', 'pwc', 'muw'].includes(cabinKey)) {
//       return;
//     }

//     // Extract period based on groupBy
//     const rawDate = new Date(item.created_at);
//     let period;
//     if (groupBy === 'month') {
//       period = `${rawDate.getFullYear()}-${String(rawDate.getMonth() + 1).padStart(2, '0')}`;
//     } else {
//       period = rawDate.toISOString().split('T')[0]; // YYYY-MM-DD
//     }

//     // Log the original data for comparison
//     rawDataLog.push({ period, cabinKey, feedback, rawDate: item.created_at });

//     // Initialize the period if not already present
//     if (!result[period]) {
//       result[period] = {
//         period,
//         mwc: 0,
//         fwc: 0,
//         pwc: 0,
//         muw: 0,
//         all: 0,
//         mwcCount: 0,
//         fwcCount: 0,
//         pwcCount: 0,
//         muwCount: 0,
//       };
//     }

//     // Accumulate feedback for the corresponding cabin key
//     result[period][cabinKey] += feedback;
//     result[period][`${cabinKey}Count`] += 1;
//     result[period].all += feedback;
//   });

//   // Log intermediate result after processing all items
//   console.log('Intermediate Result (Before Transformation):', result);

//   // Calculate the averages and map to chart data
//   const feedbackchartData = Object.values(result)
//     .map((entry) => {
//       const transformedEntry = {
//         period: entry.period,
//         mwc: entry.mwcCount ? parseFloat((entry.mwc / entry.mwcCount).toFixed(1)) : 0,
//         fwc: entry.fwcCount ? parseFloat((entry.fwc / entry.fwcCount).toFixed(1)) : 0,
//         pwc: entry.pwcCount ? parseFloat((entry.pwc / entry.pwcCount).toFixed(1)) : 0,
//         muw: entry.muwCount ? parseFloat((entry.muw / entry.muwCount).toFixed(1)) : 0,
//         all: parseFloat(
//           (
//             (entry.mwc + entry.fwc + entry.pwc + entry.muw) /
//             (entry.mwcCount + entry.fwcCount + entry.pwcCount + entry.muwCount || 1)
//           ).toFixed(1)
//         ),
//       };

//       // Log the transformed entry
//       transformedDataLog.push(transformedEntry);

//       return transformedEntry;
//     })
//     .sort((a, b) => a.period.localeCompare(b.period));

//   // Log the transformed data
//   console.log('Transformed Chart Data:', feedbackchartData);

//   // Compare Original and Transformed Data
//   console.log('Original Data (Raw):', rawDataLog);
//   console.log('Transformed Data:', transformedDataLog);

//   return feedbackchartData;
// }



export function transformFeedbackDataToChart(data = [], groupBy = 'day') {
  const result = {}; // This stores the intermediate result
  const rawDataLog = []; // To store the original data for comparison
  const transformedDataLog = []; // To store the final transformed data

  // Iterate over each item in the data
  data.forEach((item) => {
    const cabinKey = item.cabin?.cabin_name?.toLowerCase(); // 'mwc', 'fwc', etc.
    const feedback = parseFloat(item.AverageFeedback);

    // Validate if feedback is a number
    if (isNaN(feedback)) {
      return; // Skip invalid feedback
    }

    // Ensure that cabinKey is valid
    if (!['mwc', 'fwc', 'pwc', 'muw'].includes(cabinKey)) {
      return;
    }

    // Extract period based on groupBy
    const rawDate = new Date(item.created_at);
    let period;
    if (groupBy === 'month') {
      period = `${rawDate.getFullYear()}-${String(rawDate.getMonth() + 1).padStart(2, '0')}`;
    } else {
      period = rawDate.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    // Log the original data for comparison
    rawDataLog.push({ period, cabinKey, feedback, rawDate: item.created_at });

    // Initialize the period if not already present
    if (!result[period]) {
      result[period] = {
        period,
        mwc: 0,
        fwc: 0,
        pwc: 0,
        muw: 0,
        all: 0,
        mwcCount: 0,
        fwcCount: 0,
        pwcCount: 0,
        muwCount: 0,
      };
    }

    // Accumulate feedback for the corresponding cabin key
    result[period][cabinKey] += feedback;
    result[period][`${cabinKey}Count`] += 1;
    result[period].all += feedback;
  });


  // Calculate the averages and map to chart data
  const feedbackchartData = Object.values(result)
    .map((entry) => {
      // Calculate raw averages
      let mwc = entry.mwcCount ? parseFloat((entry.mwc / entry.mwcCount).toFixed(1)) : 0;
      let fwc = entry.fwcCount ? parseFloat((entry.fwc / entry.fwcCount).toFixed(1)) : 0;
      let pwc = entry.pwcCount ? parseFloat((entry.pwc / entry.pwcCount).toFixed(1)) : 0;
      let muw = entry.muwCount ? parseFloat((entry.muw / entry.muwCount).toFixed(1)) : 0;

      // Apply override if average is less than 3
      if (mwc < 3) mwc = 3.5;
      if (fwc < 3) fwc = 3.5;
      if (pwc < 3) pwc = 3.5;
      if (muw < 3) muw = 3.5;

      const transformedEntry = {
        period: entry.period,
        mwc,
        fwc,
        pwc,
        muw,
        all: parseFloat(((mwc + fwc + pwc + muw) / 4).toFixed(1)), // Use adjusted values
      };

      // Log the transformed entry
      transformedDataLog.push(transformedEntry);

      return transformedEntry;
    })
    .sort((a, b) => a.period.localeCompare(b.period));

  return feedbackchartData;
}
