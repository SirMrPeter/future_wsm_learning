/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
/**
=========================================================
* Distance Learning React - v1.1.0
=========================================================

Coded by Ambro-Dev

*/

import { useContext, useEffect, useMemo, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Distance Learning React components
import MDBox from "components/MDBox";

// Distance Learning React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Calendar from "examples/Calendar";

// Widgets page components
import UpcomingEvents from "layouts/pages/widgets/components/UpcomingEvents";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "context/socket";
import useAuth from "hooks/useAuth";
import MDTypography from "components/MDTypography";
import MDEditor from "components/MDEditor";
import { Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import OrderInfo from "./components/OrderInfo";
import OrderList from "./components/order-list";
import UploadFile from "./components/UploadFile/index";
import CourseEdit from "./components/CourseEdit";

// Data

function Widgets() {
  const { t } = useTranslation("translation", { keyPrefix: "courseinfo" });
  const { auth } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.id;
  const [calendarEventsData, setCalendarEventsData] = useState([]);
  const [nextEvents, setNextEvents] = useState([]);
  const { socket } = useContext(SocketContext);
  const axiosPrivate = useAxiosPrivate();
  const [description, setDescription] = useState();
  const [editing, setEditing] = useState(false);

  const handleOpen = async (info) => {
    info.jsEvent.preventDefault();
    console.log(info.event);
    const selectedEvent = {
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      description: info.event.extendedProps.description,
      _id: info.event.extendedProps._id,
      url: info.event.url,
    };

    navigate("/pages/account/invoice", { state: selectedEvent });
  };

  useEffect(() => {
    console.log(courseId);
    // Make API call using Axios
    axiosPrivate
      .get(`/events/${courseId}`)
      .then((response) => {
        // Update state with fetched data
        setCalendarEventsData(response.data);
        const currentDateTime = new Date();

        const futureEvents = response.data.filter((event) => {
          const eventStartDate = new Date(event.start); // convert start date to Date object
          return eventStartDate >= currentDateTime; // filter events that start now or in the future
        });
        setNextEvents(futureEvents);
      })
      .catch((error) => {
        console.log(error);
      });

    axiosPrivate
      .get(`/courses/${courseId}`)
      .then((response) => {
        // Update state with fetched data
        const { data } = response;
        setDescription(data.description);
      })
      .catch((error) => {
        console.log(error);
      });

    socket.emit("join-course", courseId);

    socket.on("event", (event) => {
      setCalendarEventsData((prevEvents) => [...prevEvents, event]);
    });

    return () => {
      socket.emit("leave-course", courseId);
    };
  }, []);

  const handleSave = () => {
    setEditing(!editing);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {auth.roles.includes(5150) ? (
              <Grid item xs={12} sm={6} lg={5}>
                <CourseEdit
                  courseId={courseId}
                  setEditing={setEditing}
                  editing={editing}
                  handleSave={handleSave}
                />
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} lg={5}>
                <OrderInfo courseId={courseId} />
              </Grid>
            )}
            <Grid item xs={12} sm={6} lg={7}>
              <Card mb={2}>
                {auth.roles.includes(5150) ? (
                  editing ? (
                    <MDBox p={2}>
                      <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                        <MDTypography
                          component="label"
                          variant="h6"
                          fontWeight="medium"
                          color="text"
                        >
                          {t("descinfo")}
                        </MDTypography>
                      </MDBox>
                      <MDBox sx={{ overflow: "auto", maxHeight: 250 }}>
                        <MDEditor value={description} onChange={setDescription} />
                      </MDBox>
                    </MDBox>
                  ) : (
                    <MDBox p={2}>
                      <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                        <MDTypography
                          component="label"
                          variant="h6"
                          fontWeight="medium"
                          color="text"
                        >
                          {t("descinfo")}
                        </MDTypography>
                      </MDBox>
                      <MDBox sx={{ overflow: "auto", maxHeight: 250 }}>
                        <MDTypography
                          color="text"
                          variant="body2"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      </MDBox>
                    </MDBox>
                  )
                ) : (
                  <MDBox p={2}>
                    <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <MDTypography component="label" variant="h6" fontWeight="medium" color="text">
                        {t("descinfo")}
                      </MDTypography>
                    </MDBox>
                    <MDBox sx={{ overflow: "auto", maxHeight: 250 }}>
                      <MDTypography
                        color="text"
                        variant="body2"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </MDBox>
                  </MDBox>
                )}
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={5}>
            {useMemo(() => (
              <Calendar
                header={{ title: `${t("caltitle")}` }}
                initialView="dayGridMonth"
                events={calendarEventsData}
                eventClick={handleOpen}
                locale={t("callang")}
              />
            ))}
          </Grid>
          <Grid item xs={12} lg={3}>
            <UpcomingEvents events={nextEvents} courseId={courseId} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <UploadFile courseId={courseId} />
          </Grid>
        </Grid>
      </MDBox>
      <OrderList courseId={courseId} />
      <Footer />
    </DashboardLayout>
  );
}

export default Widgets;
