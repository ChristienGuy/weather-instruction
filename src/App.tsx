import React, { useEffect, useState } from "react";
import Loader, { LoadState } from "./Loader";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 32px;
`;

const Advice = styled.span`
  font-size: 2.5rem;
`;

const getGeolocation = () => {
  return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    } else {
      reject("geolocation does not exist");
    }
  });
};

const App = () => {
  const [loadState, setloadState] = useState<LoadState>(LoadState.LOADING);

  const [{ needAJacket }, setForecast] = useState<{
    needAJacket: boolean | null;
  }>({ needAJacket: null });

  useEffect(() => {
    getGeolocation().then(geoLocation => {
      if (geoLocation) {
        const { lat, lng } = geoLocation;
        fetch(`/.netlify/functions/forecast?lat=${lat}&lng=${lng}`)
          .then(res => res.json())
          .then(json => {
            setForecast(json);
            setloadState(LoadState.LOADED);
          });
      }
    });
  }, []);

  return (
    <Wrapper>
      <Loader loadState={loadState}>
        <Advice>{needAJacket ? "Wear a jacket" : "Don't wear a jacket"}</Advice>
      </Loader>
    </Wrapper>
  );
};

export default App;
