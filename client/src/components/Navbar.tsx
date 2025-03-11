import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Navbar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer", textDecoration: "none" }} component={Link} to="/" color="inherit">
                    Building Energy Analysis
                </Typography>

                <Box sx={{ display: "flex", gap: 2, listStyle: "none", p: 0, m: 0 }} >
                    <li>
                        <Link to="/buildings" style={{ textDecoration: "none", color: "inherit" }}>Buildings</Link>
                    </li>
                    <li>
                        <Link to="/compare-buildings" style={{ textDecoration: "none", color: "inherit" }}>Compare</Link>
                    </li>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
