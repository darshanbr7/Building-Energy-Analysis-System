import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Button, TextField, Box, Typography, CircularProgress, Slider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface BuildingFormData {
  name: string;
  height: number;
  dimensions: {
    east: { width: number };
    west: { width: number };
    north: { width: number };
    south: { width: number };
  };
  wwr: number;
  shgc: number;
  skylight?: BuildingSkylight;
}

interface BuildingSkylight {
  height: number;
  width: number;
}

const updateBuildingAPI = async (id: string, data: BuildingFormData) => {
  const response = await axios.put(`http://localhost:3007/api/buildings/${id}`, data);
  return response.data;
};

const createBuildingAPI = async (data: BuildingFormData) => {
  const response = await axios.post("http://localhost:3007/api/buildings", data);
  return response.data;
};

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const buildingData = location.state?.building;
  
  const [formData, setFormData] = useState<BuildingFormData>({
    name: buildingData?.name || "",
    height: buildingData?.height || 0,
    dimensions: buildingData?.dimensions || { east: { width: 0 }, west: { width: 0 }, north: { width: 0 }, south: { width: 0 } },
    wwr: buildingData?.wwr || 0.2,
    shgc: buildingData?.shgc || 0.3,
  });

  const [skylight, setSkyLight] = useState<BuildingSkylight>(buildingData?.skylight || { height: 0, width: 0 });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    height?: string;
    dimensions?: {
      east?: string;
      west?: string;
      north?: string;
      south?: string;
    };
    skylight?: {
      height?: string;
      width?: string;
    };
  }>({});

  const mutation = useMutation({
    mutationFn: buildingData ? (data: BuildingFormData) => updateBuildingAPI(buildingData._id, data) : createBuildingAPI,
    onSuccess: (data) => {
      setFormData({
        name: "",
        height: 0,
        dimensions: { east: { width: 0 }, west: { width: 0 }, north: { width: 0 }, south: { width: 0 } },
        wwr: 0.2,
        shgc: 0.3,
      });
      setSkyLight({
        height: 0,
        width: 0,
      });

      // Redirect to list of buildings after success
      navigate("/buildings");
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      height?: string;
      dimensions?: {
        east?: string;
        west?: string;
        north?: string;
        south?: string;
      };
      skylight?: {
        height?: string;
        width?: string;
      };
    } = {};

    if (!formData.name.trim()) {
      errors.name = "Building Name is required.";
    }

    if (formData.height === undefined || formData.height <= 0) {
      errors.height = "Building Height must be greater than 0.";
    }

    const dimensionErrors: { [key: string]: string } = {};
    Object.keys(formData.dimensions).forEach((direction) => {
      const dimension = formData.dimensions[direction as keyof BuildingFormData["dimensions"]];
      if (dimension.width <= 0) {
        dimensionErrors[direction] = `${direction.charAt(0).toUpperCase() + direction.slice(1)} Width must be greater than 0.`;
      }
    });
    if (formData.dimensions.east.width !== formData.dimensions.west.width) {
      dimensionErrors.east = "East and West sides must have the same width.";
      dimensionErrors.west = "East and West sides must have the same width.";
    }

    if (formData.dimensions.north.width !== formData.dimensions.south.width) {
      dimensionErrors.north = "North and South sides must have the same width.";
      dimensionErrors.south = "North and South sides must have the same width.";
    }

    if (Object.keys(dimensionErrors).length > 0) {
      errors.dimensions = dimensionErrors;
    }

    if (skylight.height > 0 || skylight.width > 0) {
      if (skylight.height <= 0) {
        errors.skylight = { ...errors.skylight, height: "Skylight Height must be greater than 0." };
      }
      if (skylight.width <= 0) {
        errors.skylight = { ...errors.skylight, width: "Skylight Width must be greater than 0." };
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const buildingData = { ...formData, skylight };
      mutation.mutate(buildingData);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", p: 3, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {buildingData ? "Edit Building" : "Create Building"}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', mt: 1, mb: 1 }}>
        <strong>Note:</strong> All height and width inputs must be in meters.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Building Name"
          name="name"
          fullWidth sx={{ mb: 2 }}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={!!formErrors.name}
          helperText={formErrors.name}
        />
        <TextField
          label="Building Height"
          name="height"
          type="number"
          fullWidth sx={{ mb: 2 }}
          value={formData.height || ""}
          onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
          required
          error={!!formErrors.height}
          helperText={formErrors.height}
        />

        <Typography variant="h6" sx={{ mb: 2 }}>Dimensions</Typography>
        {["east", "west", "north", "south"].map((direction) => (
          <TextField
            key={direction}
            label={`${direction.charAt(0).toUpperCase() + direction.slice(1)} Width`}
            name={`dimensions.${direction}.width`}
            type="number"
            fullWidth sx={{ mb: 2 }}
            value={formData.dimensions[direction as keyof BuildingFormData["dimensions"]].width || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                dimensions: {
                  ...prev.dimensions,
                  [direction]: {
                    ...prev.dimensions[direction as keyof BuildingFormData["dimensions"]],
                    width: parseFloat(e.target.value),
                  },
                },
              }))
            }
            required
            error={!!formErrors.dimensions?.[direction as keyof typeof formErrors.dimensions]}
            helperText={formErrors.dimensions?.[direction as keyof typeof formErrors.dimensions]}
          />
        ))}

        <Typography gutterBottom>Window-to-Wall Ratio (WWR)</Typography>
        <Slider
          name="wwr"
          value={formData.wwr}
          onChange={(_, newValue) => setFormData((prev) => ({ ...prev, wwr: newValue as number }))}
          min={0}
          max={1}
          step={0.01}
          marks
          valueLabelDisplay="auto"
        />

        <Typography gutterBottom>Solar Heat Gain Coefficient (SHGC)</Typography>
        <Slider
          name="shgc"
          value={formData.shgc}
          onChange={(_, newValue) => setFormData((prev) => ({ ...prev, shgc: newValue as number }))}
          min={0}
          max={1}
          step={0.01}
          marks
          valueLabelDisplay="auto"
        />

        <Typography variant="h6" sx={{ mb: 2 }}>Skylight (Optional)</Typography>
        <TextField
          label="Skylight Height"
          name="skylight.height"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={skylight.height || ""}
          onChange={(e) =>
            setSkyLight((prev) => ({
              ...prev,
              height: parseFloat(e.target.value),
            }))
          }
        />
        <TextField
          label="Skylight Width"
          name="skylight.width"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={skylight.width || ""}
          onChange={(e) =>
            setSkyLight((prev) => ({
              ...prev,
              width: parseFloat(e.target.value),
            }))
          }
          error={!!formErrors?.skylight?.width}
          helperText={formErrors?.skylight?.width}
        />

        <Button type="submit" variant="contained" fullWidth disabled={mutation.status === "pending"}>
          {mutation.status === "pending" ? <CircularProgress size={24} color="inherit" /> : buildingData ? "Update Building" : "Create Building"}
        </Button>
      </form>
    </Box>
  );
};

export default Home;
