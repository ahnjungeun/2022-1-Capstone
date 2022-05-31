import React, { useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader, Polyline, OverlayView } from '@react-google-maps/api';

// map window size
const containerStyle = {
  width: '100%',
  height: '100vh'
};

// map view center position
const center = {
  lat: 37.565,
  lng: 126.829,
};

// polyline option 
const options = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  paths: [
    { lat: 37.772, lng: -122.214 },
    { lat: 21.291, lng: -157.821 },
    { lat: -18.142, lng: 178.431 },
    { lat: -27.467, lng: 153.027 }
  ],
  zIndex: 1
};


function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBydBRhX2NUKvKWegCm0zUqpG_vlG7CNoE"
  })

  
  const [mpos, setMpos] = useState({}); // Marker position state
  const [pathList, setPathList] = useState([]); // PolyLine Path List state 
  const [map, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  // Google Map 클릭 시 setState 함수로 marker position 변경과 polyline pathlist 추가
  const onClick = (event) => {
    console.log('click and reload the marker');

    const cpose = event.latLng.toJSON()
    console.log(cpose);
    setMpos(cpose); // 0 => 0 형식으로 바꾸기 
    setPathList(prev => [...prev, cpose]); // 배열 추가 
    console.log(mpos); // 바로 안바뀜 setState 함수 특성임 (react state 특성)
  };

  const onDrag = (event) => {
    console.log('drag the marker');

    const dpose = event.latLng.toJSON();
    console.log(dpose);
    let items = [...pathList];
    items[items.length - 1] = dpose;

    setPathList(items);

  };

  // back button 클릭했을 때 이전 marker 로 돌아가기
  const onButtonClick = () => {
    const latestPosition = pathList[pathList.length - 2]
    console.log(latestPosition)
    console.log(pathList)
    setMpos(latestPosition)
    let items = [...pathList];
    items.pop();
    setPathList(items)
  }


  return isLoaded ? (
    <>
      <button onClick={onButtonClick}>Back</button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onClick}
      >
        <Marker onDrag={onDrag} draggable position={mpos}></Marker>
        <Polyline path={pathList} options={options}></Polyline>
        <></>
      </GoogleMap>
    </>
  ) : <></>
}

export default React.memo(MyComponent)