import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Select, MenuItem, CircularProgress, Card, CardContent } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer as PieResponsiveContainer } from "recharts";

interface FacadeData {
  windowArea: number;
  heatGainBTU: number;
  coolingLoadKWh: number;
  energyConsumedKWh: number;
  cost: number;
}

interface BuildingData {
  _id: string;
  name: string;
  height: number;
  wwr: number;
  shgc: number;
  skylight?: { height: number; width: number };
  dimensions: {
    east: { width: number };
    west: { width: number };
    north: { width: number };
    south: { width: number };
  };
}

interface CityData {
  city: string;
  totalHeatGainBTU: number;
  totalCoolingLoadKWh: number;
  totalEnergyConsumedKWh: number;
  totalCost: number;
}

interface AnalysisData {
  totalHeatGainBTU: number;
  totalCoolingLoadKWh: number;
  totalEnergyConsumedKWh: number;
  totalCost: number;
  facadeResults: {
    north: FacadeData;
    south: FacadeData;
    east: FacadeData;
    west: FacadeData;
    roof?: FacadeData;
  };
}

const BuildingDetails: React.FC = () => {
  const location = useLocation();
  const building: BuildingData = location.state?.building;
  const [selectedCity, setSelectedCity] = useState<string>("Mumbai");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("aa", analysisData);

  useEffect(() => {
    if (building) {
      fetchCityData(selectedCity);
    }
  }, [selectedCity, building]);

  if (!building) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Building not found.
        </Typography>
      </Box>
    );
  }

  const fetchCityData = async (city: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3007/api/analysis/cities/${building._id}`);
      setCitiesData(response.data);
    } catch (error) {
      console.error("Error fetching city data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedCities = [...citiesData].sort((a, b) => b.totalCost - a.totalCost);

  const facadeData = Object.entries(analysisData?.facadeResults || {}).map(([key, data]) => (data ? {
    name: key,
    value: data.cost,
    windowArea: data.windowArea,
    heatGain: data.heatGainBTU,
    coolingLoad: data.coolingLoadKWh,
    energyConsumed: data.energyConsumedKWh,
    cost: data.cost
  } : null)).filter(item => item !== null);

  const cityBarChartData = sortedCities.map((cityData) => ({
    name: cityData.city,
    cost: cityData.totalCost,
    heatGain: cityData.totalHeatGainBTU,
    coolingLoad: cityData.totalCoolingLoadKWh,
    energyConsumed: cityData.totalEnergyConsumedKWh,
  }));

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3007/api/analysis/calculate/${building._id}`,
        { city: selectedCity }
      );
      setAnalysisData(response.data);
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cities = ["Mumbai", "Bangalore", "Kolkata", "Delhi"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, windowArea, heatGain, coolingLoad, energyConsumed, cost } = payload[0].payload;
      return (
        <Box sx={{ backgroundColor: "white", padding: 2, borderRadius: 1, boxShadow: 3 }}>
          <Typography variant="body1"><strong>Direction:</strong> {name}</Typography>
          <Typography variant="body1"><strong>Window Area:</strong> {windowArea} m²</Typography>
          <Typography variant="body1"><strong>Heat Gain:</strong> {heatGain} BTU</Typography>
          <Typography variant="body1"><strong>Cooling Load:</strong> {coolingLoad} kWh</Typography>
          <Typography variant="body1"><strong>Energy Consumed:</strong> {energyConsumed} kWh</Typography>
          <Typography variant="body1"><strong>Cost:</strong> {cost}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Building Details</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6"><strong>Name:</strong> {building.name}</Typography>
        <Typography variant="body1"><strong>Height:</strong> {building.height} meters</Typography>
        <Typography variant="body1"><strong>WWR:</strong> {building.wwr}</Typography>
        <Typography variant="body1"><strong>SHGC:</strong> {building.shgc}</Typography>
        {building.skylight && (
          <>
            <Typography variant="body1"><strong>Skylight Height:</strong> {building.skylight.height}</Typography>
            <Typography variant="body1"><strong>Skylight Width:</strong> {building.skylight.width}</Typography>
          </>
        )}
        <Typography variant="body1"><strong>Dimensions:</strong></Typography>
        <ul>
          <li><strong>East Width:</strong> {building.dimensions.east.width} meters</li>
          <li><strong>West Width:</strong> {building.dimensions.west.width} meters</li>
          <li><strong>North Width:</strong> {building.dimensions.north.width} meters</li>
          <li><strong>South Width:</strong> {building.dimensions.south.width} meters</li>
        </ul>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Calculate Prices</Typography>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={handleCalculate} disabled={isLoading} fullWidth>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Calculate"}
          </Button>
        </Box>

        {analysisData && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Total Analysis</Typography>
            <Card variant="outlined" sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">Summary</Typography>
                <Typography variant="body1">Total Cooling Load: {analysisData.totalCoolingLoadKWh.toFixed(2)} KWh</Typography>
                <Typography variant="body1">Total Energy Consumed: {analysisData.totalEnergyConsumedKWh.toFixed(2)} KWh</Typography>
                <Typography variant="body1">Total Heat Gain: {analysisData.totalHeatGainBTU.toFixed(2)} BTU</Typography>
                <Typography variant="body1">Total Cost: ${analysisData.totalCost.toFixed(2)}</Typography>
              </CardContent>
            </Card>

            <Typography variant="h6" sx={{ mb: 2 }}>Facade Analysis</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={facadeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  labelLine={true}
                  label={({ name }: { name: string }) => name}
                >
                  {facadeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
                  ))}
                </Pie>
                <PieTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <Typography variant="h6" sx={{ mb: 2 }}>City Ranking by Total Cost</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityBarChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="cost" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default BuildingDetails;
