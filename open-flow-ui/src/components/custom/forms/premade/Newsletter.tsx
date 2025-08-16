import React from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import FormContainer from "../FormContainer";
import useUtilityStore from "@store/utilityStore";

type Props = {
    onSubmit?: (email: string) => void;
};

const NewsletterSignupForm: React.FC<Props> = ({ onSubmit }) => {
    const utilityStore = useUtilityStore();
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <Typography variant="h6" mb={2}>
                Subscribe to our Newsletter
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
                Get the latest posts and updates delivered to your inbox.
            </Typography>

            <FormContainer
                schema={{
                    table: "newsletter",
                    columns: [
                        {
                            name: "email",
                            dataType: "text"
                        }
                    ]
                }}
                handleSubmit={(values) => {
                    if (onSubmit) onSubmit(values.value.email)
                }}
                handleCancelClick={() => utilityStore.setModal({ open: false })}
            />
        </motion.div>
    );
};

export default NewsletterSignupForm;
