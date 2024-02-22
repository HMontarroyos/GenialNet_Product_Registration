import Button from "@mui/material/Button";
import { styled } from "@mui/system";

export const GradientButton = styled(Button)({
  backgroundImage: "linear-gradient(to right, #092d67, #007ebc)",
  lineHeight: "53px",
  height: "auto",
  paddingTop: "0",
  paddingBottom: "0",
  fontSize: "16px",
  fontWeight: "600",
  color: "#ffffff",
  cursor: "pointer",
  borderRadius: "15px",
  "&:hover": {
    color: "#D4D7E1",
  },
});