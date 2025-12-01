import { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from 'utils/configurable';

const useFeedback = (days=30,ComplexId) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loadding, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BaseUrl}/usage-and-feedback`,
        { days,ComplexId }, // 👈 Send `days` in request body
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,

          },
        }
      );
      setFeedbackData(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [days]); // 👈 Re-run whenever `days` changes

  return { feedbackData, loadding };
};

export default useFeedback;
