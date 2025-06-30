import { Button } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useFlowStore } from "@store/v2/flowStore";
import { useNavigate, useLocation } from 'react-router';

export function ClearFlowButton() {
  const resetFlow = useFlowStore((s) => s.resetFlow);
  const navigate = useNavigate();
  const location = useLocation();

  const updateUrlWithFlowId = (flowId: string) => {
    const params = new URLSearchParams(location.search);
    params.set('flowId', flowId);
    
    navigate({ search: "" }, { replace: true });
  };

  return (
    <Button
      onClick={() => {
        resetFlow()
        updateUrlWithFlowId('')
      }}
      variant="outlined"
      startIcon={<RestartAltIcon />}
      sx={{
        color: "#fff",
        borderColor: "#fff",
        '&:hover': { borderColor: "#9f6aff", backgroundColor: "rgba(159,106,255,0.1)" }
      }}
    >
      Clear Flow
    </Button>
  );
}
