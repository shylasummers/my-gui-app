import React, { useState } from "react";
import { ChakraProvider, Box, Heading, Text, Button, extendTheme } from "@chakra-ui/react";
import Year from "./YearText";
import VehicleType from "./VehicleType";
import AC from "./AC";
import SC03 from "./SC03";
import FiveCycleTest from "./FiveCycleTest";
import AlternateType from "./AlternateType";
import Substitution from "./Substitution";
import E10 from "./E10";
import Hydrocarbon from "./Hydrocarbon";
import PMFTP from "./PMFTP";
import PMUS06 from "./PMUS06";
import CO from "./CO";
import Formaldehyde from "./Formaldehyde";
import Altitude from "./Altitude";
import DynamicAlert from "./DynamicAlert";

let year = null;
let selectedVehicle = null;
let ac = null;
let sc03 = null;
let fiveCycleTest = null;
let alternateType = null;
let substitution = null;
let e10 = null;
let hydrocarbon = null;
let pmftp = null;
let pmus06 = null;
let co = null;
let formaldehyde = null;
let altitude = null;

let year_external = false;
let LDV_external = true;
let LDT_external = false;
let MDPV_external = false;
let ac_external = true;
let sc03_external = true;
let fiveCycleTest_external = true;
let fiveCycleTypeAlt_external = true;
let fiveCycleTypeDuel_external = false;
let fiveCycleTypeElec_external = false;
let substitution_external = true;
let e10_external = true;
let hydrocarbon_external = false;
let pmftp_external = false;
let pmus06_external = false;
let co_external = false;
let formaldehyde_external = false;
let altitude_external = false;

function App() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");

  const customTheme = extendTheme({
    colors: {
      customPrimary: {
        100: "#F3F9F9",
      },
    },
  });

  const handleClick = () => {
    try {
      if (year >= 2017 || (year == null && year_external === true)) {
        year_external = true;
      } else {
        year_external = false;
      }

      if (selectedVehicle === "Light-duty vehicle") {
        LDV_external = true;
        LDT_external = false;
        MDPV_external = false;
      } else if (selectedVehicle === "Light-duty truck") {
        LDV_external = false;
        LDT_external = true;
        MDPV_external = false;
      } else if (selectedVehicle === "Medium-duty passenger vehicle") {
        LDV_external = false;
        LDT_external = false;
        MDPV_external = true;
      } else if (selectedVehicle === "Other") {
        LDV_external = false;
        LDT_external = false;
        MDPV_external = false;
      }

      if (ac === "AC" || (ac == null && ac_external === true)) {
        ac_external = true;
      } else {
        ac_external = false;
      }

      if (sc03 === "Yes" || (sc03 == null && sc03_external === true)) {
        sc03_external = true;
      } else {
        sc03_external = false;
      }

      if (fiveCycleTest === "Yes" || (fiveCycleTest == null && fiveCycleTest_external === true)) {
        fiveCycleTest_external = true;
      } else {
        fiveCycleTest_external = false;
      }

      if (alternateType === "Alternative-fuel vehicle") {
        fiveCycleTypeAlt_external = true;
        fiveCycleTypeDuel_external = false;
        fiveCycleTypeElec_external = false;
      } else if (alternateType === "Duel-fuel vehicle using alternative fuel") {
        fiveCycleTypeAlt_external = false;
        fiveCycleTypeDuel_external = true;
        fiveCycleTypeElec_external = false;
      } else if (alternateType === "Plug-in hybrid vehicle") {
        fiveCycleTypeAlt_external = false;
        fiveCycleTypeDuel_external = false;
        fiveCycleTypeElec_external = true;
      } else if (alternateType === "Other or None") {
        fiveCycleTypeAlt_external = false;
        fiveCycleTypeDuel_external = false;
        fiveCycleTypeElec_external = false;
      }

      if (substitution === "Yes" || (substitution == null && substitution_external === true)) {
        substitution_external = true;
      } else {
        substitution_external = false;
      }

      if (e10 === "Yes" || (e10 == null && e10_external === true)) {
        e10_external = true;
      } else {
        e10_external = false;
      }

      if (hydrocarbon <= 0.05 || (hydrocarbon == null && hydrocarbon_external === true)) {
        hydrocarbon_external = true;
      } else {
        hydrocarbon_external = false;
      }

      if (pmftp <= 0.003 || (pmftp == null && pmftp_external === true)) {
        pmftp_external = true;
      } else {
        pmftp_external = false;
      }

      if (pmus06 <= 0.006 || (pmus06 == null && pmus06_external === true)) {
        pmus06_external = true;
      } else {
        pmus06_external = false;
      }

      if (co <= 4.2 || (co == null && co_external === true)) {
        co_external = true;
      } else {
        co_external = false;
      }

      if (formaldehyde <= 0.004 || (formaldehyde == null && formaldehyde_external === true)) {
        formaldehyde_external = true;
      } else {
        formaldehyde_external = false;
      }

      if (altitude <= 4000 || (altitude == null && altitude_external === true)) {
        altitude_external = true;
      } else {
        altitude_external = false;
      }
    } catch {
      setShowAlert(true);
      setAlertType("error");
      setAlertTitle("Invalid inputs.");
      setAlertContent("");
    }

    let truthValues = null;
    truthValues = {
      year_external,
      LDV_external,
      LDT_external,
      MDPV_external,
      ac_external,
      sc03_external,
      fiveCycleTest_external,
      fiveCycleTypeAlt_external,
      fiveCycleTypeDuel_external,
      fiveCycleTypeElec_external,
      substitution_external,
      e10_external,
      hydrocarbon_external,
      pmftp_external,
      pmus06_external,
      co_external,
      formaldehyde_external,
      altitude_external,
    };

    fetch("http://localhost:1000/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(truthValues),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.model.motor_vehicle_emissions_problem === "True") {
          setShowAlert(true);
          setAlertType("success");
          setAlertTitle("This vehicle is compliant.");
          setAlertContent("");
        } else {
          fetch("http://localhost:1000/discovery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              truth_values: truthValues,
              first_result: data,
            }),
          })
            .then((response) => response.json())
            .then((dataSecond) => {
              setShowAlert(true);
              setAlertType("error");
              setAlertTitle("This vehicle is not compliant.");
              setAlertContent(dataSecond.failure);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleVehicleYearChange = (value) => {
    year = value;
  };

  const handleVehicleTypeChange = (value) => {
    selectedVehicle = value;
  };

  const handleVehicleACChange = (value) => {
    ac = value;
  };

  const handleVehicleSC03Change = (value) => {
    sc03 = value;
  };

  const handleVehicleFiveCycleTestChange = (value) => {
    fiveCycleTest = value;
  };

  const handleVehicleAlternateTypeChange = (value) => {
    alternateType = value;
  };

  const handleVehicleSubstitutionChange = (value) => {
    substitution = value;
  };

  const handleVehicleE10Change = (value) => {
    e10 = value;
  };

  const handleVehicleHydrocarbonChange = (value) => {
    hydrocarbon = value;
  };

  const handleVehiclePMFTPChange = (value) => {
    pmftp = value;
  };

  const handleVehiclePMUS06Change = (value) => {
    pmus06 = value;
  };

  const handleVehicleCOChange = (value) => {
    co = value;
  };

  const handleVehicleFormaldehydeChange = (value) => {
    formaldehyde = value;
  };

  const handleVehicleAltitudeChange = (value) => {
    altitude = value;
  };

  return (
    <ChakraProvider theme={customTheme}>
      <div className="App">
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={2}
          bg="teal.500"
          height="40"
        >
          <Heading size="lg">
            Determining Compliance with Motor Vehicle Emissions Regulations
          </Heading>
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Enter the vehicle year:
          </Text>
          <Year ml="200px" onYearChange={handleVehicleYearChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            What is the type of vehicle?{" "}
          </Text>
          <VehicleType onVehicleChange={handleVehicleTypeChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Does the vehicle have air conditioning?{" "}
          </Text>
          <AC onACChange={handleVehicleACChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Is the SFTP value calculated using the values from the SC03 driving schedule?{" "}
          </Text>
          <SC03 onSC03Change={handleVehicleSC03Change} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Does this vehicle have a lower derived 5-cycle fuel economy than its vehicle-specific
            5-cycle fuel economy?{" "}
          </Text>
          <FiveCycleTest onFiveCycleTestChange={handleVehicleFiveCycleTestChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Does the vehicle use non-petroleum fuel?
          </Text>
          <AlternateType onAlternateTypeChange={handleVehicleAlternateTypeChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Were the vehicle's FTP (Federal Test Procedure) testing values used in place of SC03
            testing values in calculating SFTP testing values?
          </Text>
          <Substitution onSubstitutionChange={handleVehicleSubstitutionChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Was the vehicle tested using E10 fuel?
          </Text>
          <E10 onE10Change={handleVehicleE10Change} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Enter the combined hydrocarbon, nitric oxide, and nitrogen dioxide emissions for this
            vehicle when tested under the FTP in g/mi:
          </Text>
          <Hydrocarbon onHydrocarbonEmissionsChange={handleVehicleHydrocarbonChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Enter the particulate matter emissions for this vehicle when tested under the FTP in
            g/mi:
          </Text>
          <PMFTP onPMFTPEmissionsChange={handleVehiclePMFTPChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Enter the particulate matter emissions for this vehicle when tested under the US06
            driving schedule in g/mi:
          </Text>
          <PMUS06 onPMUS06EmissionsChange={handleVehiclePMUS06Change} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Enter the carbon monoxide emissions for this vehicle when tested under the SFTP
            (Supplemental Federal Test Procedure) in g/mi:
          </Text>
          <CO onCOEmissionsChange={handleVehicleCOChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Enter the formaldehyde emissions for this vehicle when tested under the FTP in g/mi:
          </Text>
          <Formaldehyde onFormaldehydeEmissionsChange={handleVehicleFormaldehydeChange} />
        </Box>
        <Box
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          boxShadow="md"
          bg="customPrimary.100"
        >
          <Text fontSize="xl" ml="75px">
            Enter the altitude in miles for which the FTP and SFTP testing was done:
          </Text>
          <Altitude onAltitudeChange={handleVehicleAltitudeChange} />
        </Box>
        <Box
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          bg="customPrimary.100"
        >
          {showAlert && <DynamicAlert title={alertTitle} content={alertContent} type={alertType} />}
          <Button
            colorScheme="teal"
            size="lg"
            height="65px"
            width="350px"
            onClick={handleClick}
            mt={4}
            mb={300}
          >
            Check compliance
          </Button>
        </Box>
      </div>
    </ChakraProvider>
  );
}

export default App;
