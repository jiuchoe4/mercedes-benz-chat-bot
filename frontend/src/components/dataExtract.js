// on a GET request from the Mercedes-Benz API, extract the needed information to display to the user based on the API that was called.
export const dataExtract = (e) => {
    const apiAddress = e.apiAddress
    let returnMessage = ""
    switch(apiAddress){
        case "" :
            returnMessage = e.WrittenResponse + "\n"
            e.data.forEach(vehicle => {
                let tmpString = "Vehicle ID: " + vehicle.id + "\t" + "License plate: " + vehicle.licenseplate + "\t" + "FIN" + vehicle.finorvin + "\n"
                returnMessage.concat(tmpString)
            })
            break
        
        case "tires" :
            returnMessage = e.WrittenResponse + "\n" +
                "Front Left Tire: " + e.data.tirepressurefrontleft.value + " kPa" +
                "Front Right Tire: " + e.data.tirepressurefrontright.value + " kPa" +
                "Rear Left Tire: " + e.data.tirepressurerearleft.value + " kPa" +
                "Rear Right Tire: " + e.data.tirepressurerearright.value + " kPa."
            break
        
        case "location" :
            returnMessage = e.WrittenResponse + " " + e.data.latitude.value + "latitude and " + e.data.longitude + "longitude"
            break
        
        case "fuel" :
            returnMessage = e.WrittenResponse + " " + e.data.value + "% fuel remaining."
            break
        
        case "stateofcharge" :
            returnMessage = e.WrittenResponse + " " + e.data.value + "% charge."
            break
        
        case "odometer" :
            returnMessage = e.WrittenResponse + "\n" + "Odomoter: " + e.data.odomoter.value + " km" + "\n" 
                + "Distance since set: " + e.data.distancesinceset.value + " km" + "\n" + "Distance since start:" + e.data.dostamcesomcestart.value+ " km"
            break

        case "door" :
            returnMessage = e.WrittenResponse
            break
    }

    return returnMessage
}