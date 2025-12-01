import { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from 'utils/configurable';

const useUsageProfile = (days=30,ComplexId=null) => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BaseUrl}/usage-profile`,
        { days ,ComplexId}, 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );
      setUsageData(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [days,ComplexId]);
  return { usageData, loading };
};

export default useUsageProfile;
