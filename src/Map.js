import React, { useState, useCallback, useRef,useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker, Polyline, InfoWindow, Data } from '@react-google-maps/api';
import axios from "axios"


const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
}
const center = {
  lat: 37.560876699999795, lng: 126.8210406999998,
}
const options = {
  disableDefaultUI: true,
  zoomControl: true
}

const serverPoints = []
function getAllMarkers() {
  return axios.get('http://3.39.217.105:3000/markers')
}


const dummy = [
  { lat: 37.6584, lng: 126.8320, name: "주차장 1", category: "parking", },
  { lat: 37.65, lng: 126.83, name: "주차장 2", category: "parking", },
  { lat: 37.67, lng: 126.84, name: "길 1", category: "road", },
  { lat: 37.64, lng: 126.82, name: "길 2", category: "road", },
]



export default function Map() {
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  
  const [markers, setMarkers] = useState([]); // 클릭한 곳의 마커좌표 저장
  const [selected, setSelected] = useState(null); // 어떤 마커가 선택됐는지
  const [parkingVisible, setParkingVisible] = useState(false);
  
  useEffect(() => { 
    var res = getAllMarkers();
    res.then(response => response.data.result.map(
      x => serverPoints.push(
        {
          lat: x.coordinates.lat,
          lng: x.coordinates.lon,
          name: x.name,
          category: x.category,
        }
      )
    ))
    .catch(new Error())
    console.log(res)
  }, [])

  const onMapClick = useCallback((event) => {
    setMarkers(current => [...current,{
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      //time: new Data(),// 키값을 어떻게 넣지
    }]);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "error loading maps";
  if (!isLoaded) return "Loading Maps";

  return <div>
    <button
      onClick={() => {setParkingVisible(!parkingVisible);}}
    >주차창 보기</button>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
      options={options} //useMemo 를 써써 해보기
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      
      {console.log(serverPoints)}
      {/* {serverPoints.map(marker =>
        <Marker
          key={parseFloat(marker.lat)}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
          onClick={() => {
            setSelected(marker);
          }}
        />
      )} */}

      {/* {console.log(parkingVisible)} */}
      {serverPoints.map(marker =>
          marker.category === 'parking' && !parkingVisible ? null : <Marker
          key={parseFloat(marker.lat)}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
          onClick={() => {
            setSelected(marker);// 마커 좌표 저장
          }}
        />
      )}


      {/* 임시주석 얘 기능하는 것 지우면 안 됨 */}
      {markers.map(marker =>
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
            <h2>{selected.name}</h2>
            <h3>{selected.category}</h3>
            <p>{selected.lat} {selected.lng}</p>
          </div>
        </InfoWindow>)}
      
    </GoogleMap>
  </div>
}
