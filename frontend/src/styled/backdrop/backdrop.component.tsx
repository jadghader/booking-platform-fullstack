import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { primaryColor } from "../../assets/globals/global-constants";

interface Props {
  open: boolean;
}

const BackdropComponent = ({ open }: Props) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          color: `${primaryColor  }`,
        }} // Increase zIndex for CircularProgress
      />
    </Backdrop>
  );
};

export default BackdropComponent;
