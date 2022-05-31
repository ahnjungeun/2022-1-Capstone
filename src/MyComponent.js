import React, { useState } from 'react'
import { GoogleMap, useLoadScript, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

const myGoogleMapApiKey = "AIzaSyDz1p5uTvfqsd3ZOIdjQP0B-USCno3XLMM"

const containerStyle = {
  width: '600px',
  height: '600px'
};

const center = {
  lat: 37.5,
  lng: 127
};

const polyPos = {
  lat: 37.5,
  lng: 127
}

function MyComponent() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: myGoogleMapApiKey
  })

  const [map, setMap] = React.useState(/** @type google.maps.Map */null);
  const [mpos, setMpos] = useState({});

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  // const onLoad = infoWindow => {}

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const divStyle = {
    background: `pink`,
    padding: 15
  }

  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    // clickable: false,
    // draggable: false,
    // editable: false,
    visible: true,
    radius: 30000,
    paths: [
      { lat: 37, lng: 127 },
      { lat: 37, lng: 125 }
    ],
    zIndex: 1
  }

  const path = [
    { lat: 37.5, lng: 127 },
    { lat: 37.3, lng: 127.05 }
  ]

  return isLoaded ? (
    <>
      <button>
        수정
      </button>
      <GoogleMap
        clickableIcons={false}
        mapContainerStyle={containerStyle}
        initailCenter={center}
        center={center}
        zoom={15}
        // onLoad={onLoad}
        // onUnmount={onUnmount}
        options={{
          // zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >

        <InfoWindow
          position={center}>
          <div style={divStyle}>
            <h1 style={{whiteSpace: 'pre-wrap'}}>{center.lat}  {center.lng}</h1>
          </div>
        </InfoWindow>


        {/* onClick={() => map.panTo(center)} */}
        {/* 클릭이벤트 일어나면 center로 이동 */}



        <Marker
          position={path[1]}
        >
          
        </Marker>

        <Polyline
          path={path}
          options={options}
          draggable={true}
        >
        </Polyline>

        
      </GoogleMap>
    </>
    
  ) : <></>
}

export default React.memo(MyComponent)