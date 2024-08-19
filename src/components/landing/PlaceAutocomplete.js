import { Button, Modal, ModalBody } from "react-bootstrap";
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import debounce from 'lodash.debounce';

    // given template from google, minus debouncer
  
export default function PlaceAutocomplete({ onPlaceSelect, alerts, setAlerts }) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");
  const [disabledInput, setDisabledInput] = useState(false)

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["place_id", "geometry", "name", "address_components"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  const handlePlaceChanged = useCallback(() => {
    if (!placeAutocomplete) {
      setAlerts([...alerts, {
				variant: 'danger',
				title: 'Lobby Creation Error',
				desc: 'Unable to load Google API! Please try again.'
			}])
      setDisabledInput(true);
      
      return;
    }
    onPlaceSelect(placeAutocomplete.getPlace());
    console.log(placeAutocomplete.getPlace());  
  }, [onPlaceSelect, placeAutocomplete]);

  const debouncedHandlePlaceChanged = useMemo(
    () => debounce(handlePlaceChanged, 400),
    [handlePlaceChanged]
  );

  useEffect(() => {
    if (!placeAutocomplete) return;

    const listener = placeAutocomplete.addListener("place_changed", debouncedHandlePlaceChanged);

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [onPlaceSelect, placeAutocomplete]);
  
  return (
    <div className="autocomplete-container">
      <input disabled={disabledInput} ref={inputRef} placeholder="Search for locations..."/>
    </div>
  );
};
