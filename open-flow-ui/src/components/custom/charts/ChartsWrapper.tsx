import React from "react";
import { Box, Modal, Grid, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled }from "@mui/material/styles";

import ChartsContainer from "./ChartsContainer";


const Styled = {
    ModalContainer: styled(Box)(() => ({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "90%",
        backgroundColor: "#333",
        border: '2px solid #000',
        boxShadow: "24px",
        padding: "32px",
        borderRadius: "24px"
    }))
};

const ChartsWrapper = ({ ...props }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <>
            <ChartsContainer {...props as typeof ChartsContainer.prototype} setIsOpen={setIsOpen} />
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <Styled.ModalContainer>
                    <Grid container>
                        <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <IconButton color="inherit" onClick={() => setIsOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                        <Grid size={12}>
                            <ChartsContainer {...props as typeof ChartsContainer.prototype} />
                        </Grid>
                    </Grid>
                </Styled.ModalContainer>
            </Modal>
        </>
    )
}

export default ChartsWrapper;