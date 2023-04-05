/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-underscore-dangle */
/**
=========================================================
* Distance Learning React - v1.1.0
=========================================================

Coded by Ambro-Dev

*/

// @mui material components
import Card from "@mui/material/Card";

// Distance Learning React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Distance Learning React examples
import DefaultItem from "examples/Items/DefaultItem";
import { useState } from "react";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
import { Accordion, AccordionDetails, AccordionSummary, Divider } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useMaterialUIController } from "context";
import NewEvent from "./NewEvent";

function UpcomingEvents({ events, courseId }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <Card sx={{ height: "500px", overflow: "auto" }}>
      <MDBox pt={2} px={2} lineHeight={1} sx={{ display: "flex", justifyContent: "space-between" }}>
        <MDTypography variant="h6" fontWeight="medium" pt={1}>
          Events
        </MDTypography>
        <MDButton color="success" circular onClick={openModal}>
          Add Event
        </MDButton>
        <NewEvent open={isModalOpen} courseId={courseId} onClose={closeModal} />
      </MDBox>
      {events && events.length > 0 ? (
        events.map((event, index) => {
          const formattedStartDate = new Date(event.start).toLocaleDateString("us-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const formattedStartTime = new Date(event.start).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          return (
            <MDBox key={event._id}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`panel${index}-content`}
                >
                  <DefaultItem
                    color="dark"
                    icon="savings"
                    title={event.title}
                    description={`${formattedStartDate} at ${formattedStartTime}`}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <MDBox>
                    <Card>
                      {/* Invoice header */}
                      <MDBox p={1}>
                        <MDBox p={1}>
                          <MDBox width="100%" overflow="auto">
                            <MDTypography
                              variant="h6"
                              color={darkMode ? "text" : "secondary"}
                              fontWeight="regular"
                            >
                              Description
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular">
                              {event.description}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                        <Divider variant="middle" />
                        <MDBox width="100%" textAlign="right" mt={1}>
                          <MDBox mt={1}>
                            <MDTypography
                              component="span"
                              variant="h6"
                              fontWeight="regular"
                              color={darkMode ? "text" : "secondary"}
                            >
                              <MDButton
                                variant="gradient"
                                color="success"
                                href={event.url}
                                target="_blank"
                              >
                                Join call
                              </MDButton>
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    </Card>
                  </MDBox>
                </AccordionDetails>
              </Accordion>
            </MDBox>
          );
        })
      ) : (
        <MDBox p={2}>No events yet</MDBox>
      )}
    </Card>
  );
}

UpcomingEvents.propTypes = {
  events: PropTypes.array.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default UpcomingEvents;