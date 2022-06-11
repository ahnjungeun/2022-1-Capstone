import React, { useState, useCallback, useRef,useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker, Polyline, InfoWindow, Data } from '@react-google-maps/api';
import axios from "axios"


const mapContainerStyle = {
  width: "100vw", height: "100vh",
}
const center = {
  lat: 37.56204148687894, lng: 126.83094131509162,
}
const options = {
  disableDefaultUI: true, zoomControl: true
}

const parkings = []
const lifts = []
const toilets = []
const steps = []

export default function Map() {
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  
  const [markers, setMarkers] = useState([]); // 클릭한 곳의 마커좌표 저장
  const [selected, setSelected] = useState(null); // 어떤 마커가 선택됐는지

  const [parkingsVisible, setParkingsVisible] = useState(true);
  const [liftsVisible, setLiftVisible] = useState(true);
  const [toiletsVisible, setToiletsVisible] = useState(true);
  const [stepsVisible, setStepsVisible] = useState(true);
  

  useEffect(() => {
    axios.get('http://3.39.217.105:3000/lifts')
      .then(response => response.data.result.map(
      x => lifts.push(
        {
          lat: x.coordinates.lat,
          lng: x.coordinates.lon,
          name: "승강기",
          category: "lifts",
        }
      ))
    )
      .catch(new Error())
    
    axios.get('http://3.39.217.105:3000/steps')
      .then(response => response.data.result.map(
      x => steps.push(
        {
          lat: x.coordinates.lat,
          lng: x.coordinates.lon,
          name: "단차",
          category: "steps",
        }
      ))
    )
      .catch(new Error())
    
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
    <button
      onClick={() => {setParkingsVisible(!parkingsVisible);}}
    >주차창 보기</button>
    <button
      onClick={() => {setLiftVisible(!liftsVisible);}}
    >승강기 보기</button>
    <button
      onClick={() => {setToiletsVisible(!toiletsVisible);}}
    >화장실 보기</button>
    <button
      onClick={() => {setStepsVisible(!stepsVisible);}}
    >단차 보기</button>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={16}
      center={center}
      options={options} //useMemo 를 써써 해보기
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      
      {lifts.map(marker =>
          !liftsVisible ? null : <Marker
          key={parseFloat(marker.lat)}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
          icon={{
            url: "https://cdn-icons-png.flaticon.com/512/2084/2084189.png",
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15,15)
          }}
          onClick={() => {
            setSelected(marker);// 마커 좌표 저장
          }}
        />
      )}

      {steps.map(marker =>
          !stepsVisible ? null : <Marker
          key={parseFloat(marker.lat)}
          position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
          icon={{
            url: "https://cdn-icons.flaticon.com/png/512/3756/premium/3756730.png?token=exp=1654946100~hmac=7a092751cd5f89c7ad653d72ec9a51d0",
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15,15)
          }}
          onClick={() => {
            setSelected(marker);// 마커 좌표 저장
          }}
        />
      )}

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
