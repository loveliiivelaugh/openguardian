import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItemText,
    Stack,
    Typography,
    Link as MuiLink,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router";

export type AccordionItemProps = {
    title: string;
    subtitle?: string;
    period?: string;
    content?: React.ReactNode;
    details?: string[];
    links?: {
        companySite?: string;
        linkedin?: string;
    };
};

export const AccordionListItem: React.FC<AccordionItemProps> = ({
    title,
    subtitle,
    period,
    details,
    links,
    content
}) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${title}-content`}
                id={`panel-${title}-header`}
            >
                <ListItemText
                    primary={<Typography variant="h5">{title}</Typography>}
                    secondary={
                        subtitle && (
                            <Typography variant="body1">
                                <b>{subtitle}</b>
                            </Typography>
                        )
                    }
                />
            </AccordionSummary>
            <AccordionDetails>
                {content}
                {/* {period && <Typography variant="h6">{period}</Typography>}
                <List>
                    {details.map((detail, index) => (
                        <ListItemText key={index} primary={detail} />
                    ))}
                </List>
                {links && (links.companySite || links.linkedin) && (
                    <Stack direction="row" gap={2} mt={1}>
                        {links.companySite && (
                            <MuiLink
                                component={RouterLink}
                                to={links.companySite}
                                target="_blank"
                            >
                                Company Site
                            </MuiLink>
                        )}
                        {links.linkedin && (
                            <MuiLink
                                component={RouterLink}
                                to={links.linkedin}
                                target="_blank"
                            >
                                LinkedIn
                            </MuiLink>
                        )}
                    </Stack>
                )} */}
            </AccordionDetails>
        </Accordion>
    );
};
