import React, { useState, useCallback, useRef,useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker, Polyline, InfoWindow, Data } from '@react-google-maps/api';
// import { formatRelative } from "data-fns"
import axios from "axios"

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
}
const center = {
  lat: 37.6584,
  lng: 126.8320
}
const options = {
  disableDefaultUI: true,
  zoomControl: true
}
const points = [
  { lat: 37.65, lng: 126.80, name: "test1" },
  { lat: 37.6586, lng: 126.8578, name: "test2" }
]

function getAllMarkers() {
  return axios.get('http://3.39.217.105:3000/markers')
}

const serverPoints = []


export default function Map() {
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null); // 어떤 마커가 선택됐는지

  useEffect(() => {
    var res = getAllMarkers();
    res.then(response => response.data.result.map(x =>
      setMarkers(current => [...current, {
        lat: x.coordinates.lat,
        lng: x.coordinates.lng,
        name: x.name
      }])
    ));
  }, [])
  
  useEffect(() => { 
    var res = getAllMarkers();
    res.then(response => response.data.result.map(
      x => serverPoints.push(
        {
          lat: x.coordinates.lat,
          lng: x.coordinates.lon,
          name: x.name
        }
      )
    ))
  }, [])

  const onMapClick = useCallback((event) => {
    setMarkers(current => [...current,{
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      // 키값을 어떻게 넣지
    }]);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "error loading maps";
  if (!isLoaded) return "Loading Maps";

  return <div>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
      options={options} //useMemo 를 써써 해보기
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      
      {console.log(serverPoints)}
      {serverPoints.map(marker =>
        <Marker
          key={parseFloat(marker.lat)}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
          onClick={() => {
            setSelected(marker);
          }}
        />
      )}

      {!markers ? null : markers.map(marker =>
        <Marker
          key={parseFloat(marker.lat)}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
          onClick={() => {
            setSelected(marker);// 마커 좌표 저장
          }}
        />
      )}

      {!selected ? null : (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => {
            setSelected(null); //토글링 안 하면 인포윈도 제일 첨에만 뜸
          }}>
          <div>
            <h2>{ selected.name }</h2>
            <p>{selected.lat} {selected.lng}</p>
          </div>
        </InfoWindow>)}
      
    </GoogleMap>
  </div>
}
