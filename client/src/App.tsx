import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Home from "./components/Home";
import Buildings from "./components/Buildings";
import BuildingDetails from "./components/BuildingDetails";
import ComparePage from "./components/ComparePage";
const App: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/buildings" element={<Buildings />} />
                    <Route path="/edit-building" element={<Home />} />
                    <Route path="/building-details" element={<BuildingDetails />} />
                    <Route path="/compare-buildings" element = {<ComparePage/>} />
                </Routes>
            </Container>
        </div>
    )
}
export default App