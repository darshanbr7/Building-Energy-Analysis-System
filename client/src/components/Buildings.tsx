import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const fetchBuildings = async () => {
  const response = await axios.get("http://localhost:3007/api/buildings");
  return response.data;
};


const deleteBuildingAPI = async (id: string) => {
  await axios.delete(`http://localhost:3007/api/buildings/${id}`);
};

const Buildings: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: buildings, isLoading, error } = useQuery({
    queryKey: ["buildings"],
    queryFn: fetchBuildings,
  });
  const handleEdit = (building: any) => {
    navigate("/edit-building", { state: { building } });
  };

  const handleViewDetails = (building: any) => {
    navigate("/building-details", { state: { building } });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteBuildingAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>All Buildings</Typography>

      {isLoading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}

      {error && <Typography color="error">Failed to load buildings.</Typography>}

      {!isLoading && !error && buildings?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Building Name</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buildings.map((building: any) => (
                <TableRow key={building._id}>
                  <TableCell
                    onClick={() => handleViewDetails(building)}
                    sx={{
                      cursor: "pointer",
                      color: "blue",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {building.name}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(building)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteMutation.mutate(building._id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !isLoading && <Typography sx={{ textAlign: "center", mt: 2 }}>No buildings found.</Typography>
      )}
    </Box>
  );
};

export default Buildings;
