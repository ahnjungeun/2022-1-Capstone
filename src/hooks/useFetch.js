import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (initialUrl) => {
  const [url, setUrl] = useState(process.env.REACT_APP_BASE_URL+initialUrl);
  const [value, setValue] = useState([]);

  console.log(url)

  useEffect(() => {
    axios.get(url)
      .then(response => response.data.result.map(
        x => setValue(current => [...current, {
          lat: x.coordinates.lat,
          lng: x.coordinates.lon,
          name: initialUrl,
          category: initialUrl,
          // 여기 수정해야 함
        }]
        ))
      )
      .catch(new Error())
  }, [url]);

  return value
}
export default useFetch;
