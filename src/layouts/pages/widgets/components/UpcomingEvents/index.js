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
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";

function UpcomingEvents({ events, courseId }) {
  const { t } = useTranslation("translation", { keyPrefix: "courseinfo" });
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleOpen = async (e) => {
    e.preventDefault();
    const course = {
      id: courseId,
    };

    navigate("/applications/wizard", { state: course });
  };

  return (
    <Card sx={{ height: "500px" }}>
      <MDBox
        pt={2}
        px={2}
        pb={1}
        lineHeight={1}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <MDTypography variant="h6" fontWeight="medium" pt={1}>
          {t("upcevents")}
        </MDTypography>
        {auth.roles.includes(5150) && (
          <MDButton color="success" circular onClick={handleOpen}>
            {t("addevent")}
          </MDButton>
        )}
      </MDBox>
      <MDBox sx={{ overflow: "auto" }}>
        {events && events.length > 0 ? (
          events.map((event, index) => {
            const formattedStartDate = new Date(event.start).toLocaleDateString(`${t("date")}`, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const formattedStartTime = new Date(event.start).toLocaleTimeString(`${t("date")}`, {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            const formattedEndDate = new Date(event.end).toLocaleDateString(`${t("date")}`, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const formattedEndTime = new Date(event.end).toLocaleTimeString(`${t("date")}`, {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            return (
              <MDBox key={event._id}>
                <DefaultItem
                  color="dark"
                  type={event.className}
                  title={event.title}
                  description={`${formattedStartDate}, ${formattedStartTime}`}
                  eventdescription={event.description}
                  url={event.url}
                  index={index}
                  classname={event.className}
                  event={event._id}
                  start={`${formattedStartDate}, ${formattedStartTime}`}
                  end={`${formattedEndDate}, ${formattedEndTime}`}
                />
              </MDBox>
            );
          })
        ) : (
          <MDBox p={2}>{t("noevents")}</MDBox>
        )}
      </MDBox>
    </Card>
  );
}

UpcomingEvents.propTypes = {
  events: PropTypes.array.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default UpcomingEvents;
