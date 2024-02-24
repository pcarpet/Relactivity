import { useState } from "react";
import Carte from "./Carte";
import Poi from "./Poi";

export default function Space({ activitiesList, tripStartDate, tripEndDate, hoursRange, addEtape }) {

    const [poiData, setPoiData] = useState(null)

    function displayPoiData(poiData) {
        console.log(poiData);
        setPoiData(poiData);
    }

    return (
        <div>
            <Carte
                activitiesList={activitiesList}
                displayPoiData={displayPoiData}
            />
            {poiData !== null ? (
                <Poi
                    poiData={poiData}
                    tripStartDate={tripStartDate}
                    tripEndDate={tripEndDate}
                    hoursRange={hoursRange}
                    addEtape={addEtape}
                />
            ) : ''}

        </div>
    );


}