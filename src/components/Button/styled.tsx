import Button from "@mui/material/Button";
import { styled } from "@mui/system";

export const GradientButton = styled(Button)(({ theme, disabled }) => ({
  marginTop: "10px",
  backgroundImage: disabled ? "linear-gradient(to right, #cccccc, #cccccc)" : "linear-gradient(to right, #092d67, #007ebc)",
  lineHeight: "53px",
  height: "auto",
  paddingTop: "0",
  paddingBottom: "0",
  fontSize: "16px",
  fontWeight: "600",
  color: disabled ? "#ffffff" : "#ffffff", 
  cursor: "pointer",
  borderRadius: "15px",
  "&:hover": {
    color: disabled ? "#ffffff" : "#D4D7E1", 
  },
}));
