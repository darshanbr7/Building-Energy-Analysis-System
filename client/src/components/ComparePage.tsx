import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Box, Typography, Paper, Button } from "@mui/material";
import axios from "axios";
import Select from "react-select"; // Import Select from react-select
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface Building {
  _id: string;
  name: string;
}

const ComparePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [building, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding1, setSelectedBuilding1] = useState<Building | null>(null);
  const [selectedBuilding2, setSelectedBuilding2] = useState<Building | null>(null);
  const [city, setCity] = useState<{ value: string; label: string }>({ value: "Mumbai", label: "Mumbai" });
  const [error, setError] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);

  useEffect(() => {
    const cachedBuildings = queryClient.getQueryData<Building[]>(["buildings"]);
    if (cachedBuildings) {
      setBuildings(cachedBuildings);
    }
  }, [queryClient]);

  if (!building || building.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Buildings data is not available yet. Please fetch the data again.
        </Typography>
      </Box>
    );
  }

  const handleCompare = async () => {
    if (selectedBuilding1?._id === selectedBuilding2?._id) {
      setError("Building 1 and Building 2 cannot be the same!");
      return;
    }
    setError(null);

    try {
      const url = `http://localhost:3007/api/analysis/compare/${selectedBuilding1?._id}/${selectedBuilding2?._id}/${city.value}`;
      const response = await axios.get(url);
      console.log(response.data);
      setComparisonData(response.data);
    } catch (error) {
      console.error("Error comparing buildings:", error);
    }
  };

  console.log("aax", comparisonData);
  const result1 = comparisonData?.result1;
  const result2 = comparisonData?.result2;

  const facadeMetrics = [
    { name: "East", building1: result1?.facadeResults?.east?.cost ?? 0, building2: result2?.facadeResults?.east?.cost ?? 0 },
    { name: "West", building1: result1?.facadeResults?.west?.cost ?? 0, building2: result2?.facadeResults?.west?.cost ?? 0 },
    { name: "North", building1: result1?.facadeResults?.north?.cost ?? 0, building2: result2?.facadeResults?.north?.cost ?? 0 },
    { name: "South", building1: result1?.facadeResults?.south?.cost ?? 0, building2: result2?.facadeResults?.south?.cost ?? 0 },
    { name: "Roof", building1: result1?.facadeResults?.roof?.cost ?? 0, building2: result2?.facadeResults?.roof?.cost ?? 0 }
  ];

  const totalMetricsData = [
    { name: "Heat Gain (BTU)", building1: result1?.totalHeatGainBTU ?? 0, building2: result2?.totalHeatGainBTU ?? 0 },
    { name: "Cooling Load (kWh)", building1: result1?.totalCoolingLoadKWh ?? 0, building2: result2?.totalCoolingLoadKWh ?? 0 },
    { name: "Energy Consumed (kWh)", building1: result1?.totalEnergyConsumedKWh ?? 0, building2: result2?.totalEnergyConsumedKWh ?? 0 },
    { name: "Cost (₹)", building1: result1?.totalCost ?? 0, building2: result2?.totalCost ?? 0 }
  ];

  const selectCities = [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Delhi", label: "Delhi" },
    { value: "Kolkata", label: "Kolkata" }
  ];

  const selectOptions = building.map((b) => ({
    value: b._id,
    label: b.name
  }));

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Compare Buildings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Select Building 1</Typography>
        <Select
          options={selectOptions}
          value={selectedBuilding1 ? { value: selectedBuilding1._id, label: selectedBuilding1.name } : null}
          onChange={(selectedOption) => {
            setSelectedBuilding1(building.find((b) => b._id === selectedOption?.value) || null);
          }}
          isClearable
        />

        <Typography variant="h6">Select Building 2</Typography>
        <Select
          options={selectOptions}
          value={selectedBuilding2 ? { value: selectedBuilding2._id, label: selectedBuilding2.name } : null}
          onChange={(selectedOption) => {
            setSelectedBuilding2(building.find((b) => b._id === selectedOption?.value) || null);
          }}
          isClearable
        />

        {error && <Typography color="error">{error}</Typography>}

        <Typography variant="h6">Select City</Typography>
        <Select
          value={city}
          onChange={(selectedOption) => setCity(selectedOption as { value: string; label: string })}
          options={selectCities}
        />

        <Button variant="contained" onClick={handleCompare} fullWidth>
          Compare
        </Button>
      </Paper>

      {comparisonData && (
        <>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Facade Comparison (Cost)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facadeMetrics}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="building1" name={selectedBuilding1?.name} fill="#8884d8" />
                <Bar dataKey="building2" name={selectedBuilding2?.name} fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Total Metrics Comparison</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={totalMetricsData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="building1" name={selectedBuilding1?.name} fill="#8884d8" />
                <Bar dataKey="building2" name={selectedBuilding2?.name} fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ComparePage;
