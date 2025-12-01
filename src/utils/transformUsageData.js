

// export function transformUsageDataToChart(data = []) {
//   const result = {};

//   data.forEach((item) => {
//     const { period, cabin_name, user_count } = item;

//     if (!result[period]) {
//       result[period] = {
//         period,
//         mwc: 0,
//         fwc: 0,
//         pwc: 0,
//         mur: 0,
//         all: 0,
//       };
//     }

//     const cabinKey = cabin_name?.toLowerCase(); // e.g., 'mwc', 'fwc', etc.

//     if (['mwc', 'fwc', 'pwc', 'mur'].includes(cabinKey)) {
//       result[period][cabinKey] += parseInt(user_count);
//       result[period].all += parseInt(user_count);
//     }
//   });

//   // Convert to array sorted by period
//   return Object.values(result).sort((a, b) => a.period.localeCompare(b.period));
// }


export function transformUsageDataToChart(data = []) {

  const result = {};

  data.forEach((item) => {
    // console.log(item, 'item');
    const { period, cabin_name, user_count } = item;

    if (!result[period]) {
      result[period] = {
        period,
        mwc: 0,
        fwc: 0,
        pwc: 0,
        muw: 0, // Make sure 'muw' starts with 0 as default
      };
    }

    const cabinKey = cabin_name?.toLowerCase(); // e.g., 'mwc', 'fwc', etc.

    if (['mwc', 'fwc', 'pwc', 'muw'].includes(cabinKey)) {
      // Only increment if it's not null or undefined
      if (cabinKey === 'muw' && item.cabin_name === 'MUW' && item.user_count !== null) {
        result[period][cabinKey] += parseInt(user_count);
      }

      else if (['mwc', 'fwc', 'pwc', 'muw'].includes(cabinKey)) {
        result[period][cabinKey] += parseInt(user_count);
      }

      result[period].all += parseInt(user_count);
    }
  });

  // Convert to array sorted by period
  const dataA = Object.values(result).sort((a, b) => a.period.localeCompare(b.period));

  return dataA;
}

