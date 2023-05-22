/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
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
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useEffect, useRef, useState } from "react";
import MDSnackbar from "components/MDSnackbar";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { Autocomplete, Checkbox, Grid, TextField } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "examples/LayoutContainers/PageLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import pageRoutes from "page.routes";

function EditCourse({ loading, setLoading }) {
  const [manage, setManage] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state;
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [description, setDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [teacher, setTeacher] = useState({});
  const [newTeacher, setNewTeacher] = useState({});
  const [teachersList, setTeachersList] = useState([]);
  const [members, setMembers] = useState([]);
  const [changed, setChanged] = useState(false);

  const [successSB, setSuccessSB] = useState(false);
  const errRef = useRef();

  const [errMsg, setErrMsg] = useState("");

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  useEffect(() => {
    console.log(course);
    if (course) {
      setName(course.name);
      setNewName(course.name);
      setDescription(course.description);
      setNewDescription(course.description);
      axiosPrivate
        .get(`users/${course.teacherId}`)
        .then((response) => {
          setTeacher(response.data);
          setNewTeacher(response.data);
        })
        .catch((error) => {
          console.error(error);
        });

      axiosPrivate
        .get(`courses/${course.id}/members`)
        .then((response) => {
          const newRows = response.data.map((row) => ({ ...row, isSelected: false }));
          setMembers(newRows);
        })
        .catch((error) => {
          console.error(error);
        });

      axiosPrivate
        .get("users/teachers")
        .then((response) => {
          setTeachersList(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loading]);

  useEffect(() => {
    const hasChanges = newDescription !== description || newName !== name || newTeacher !== teacher;
    setChanged(hasChanges);
  }, [newDescription, newName, newTeacher]);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Course Created"
      content="Course created successfully"
      dateTime="now"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCourse = { name, description, teacherId: teacher };
      console.log(newCourse);
      const response = await axiosPrivate.post(
        process.env.REACT_APP_CREATE_COURSE_URL,
        JSON.stringify(newCourse),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // TODO: remove console.logs before deployment
      console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response))
      // clear state and controlled inputs
      setChanged(false);
      setLoading(!loading);
      openSuccessSB();
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Emailname Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  const handleSelectAll = (selected) => {
    const newRows = members.map((row) => ({ ...row, isSelected: selected }));
    setMembers(newRows);
    if (selected) {
      setSelectedRowIds(newRows.map((row) => row._id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleRemoveMembers = () => {
    axiosPrivate
      .post(`/admin/${course.id}/members`, { memberIds: selectedRowIds })
      .then((response) => {
        console.log(response);
      });
  };

  const handleRowSelect = (rowId, isSelected) => {
    if (isSelected) {
      // add row ID to selectedRowIds if it's not already in the array
      if (!selectedRowIds.includes(rowId)) {
        setSelectedRowIds([...selectedRowIds, rowId]);
      }
      // set isSelected property of selected row to true
      const newRows = members.map((row) => {
        if (row._id === rowId) {
          return { ...row, isSelected: true };
        }
        return row;
      });
      setMembers(newRows);
    } else {
      // remove row ID from selectedRowIds if it's in the array
      setSelectedRowIds(selectedRowIds.filter((id) => id !== rowId));
      // set isSelected property of deselected row to false
      const newRows = members.map((row) => {
        if (row._id === rowId) {
          return { ...row, isSelected: false };
        }
        return row;
      });
      setMembers(newRows);
    }
  };

  return (
    <PageLayout>
      <DefaultNavbar routes={pageRoutes} transparent />
      <MDBox my={3} mt={12} ml={1} mr={1}>
        <Card sx={{ marginTop: 3 }}>
          <MDBox ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
          </MDBox>
          <MDBox
            variant="gradient"
            bgColor="secondary"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            my={3}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Edit Course
            </MDTypography>
          </MDBox>

          <MDBox pt={4} pb={3} px={3}>
            {course ? (
              <MDBox component="form" role="form">
                <Grid container spacing={1}>
                  <Grid item xs={8} lg={10}>
                    {edit ? (
                      <MDBox display="flex" flexDirection="column">
                        <MDBox mb={2}>
                          <MDInput
                            type="text"
                            label="Name"
                            variant="standard"
                            required
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            fullWidth
                          />
                        </MDBox>
                        <MDBox mb={2}>
                          <MDInput
                            type="text"
                            label="Description"
                            multiline
                            variant="standard"
                            value={newDescription}
                            required
                            onChange={(e) => setNewDescription(e.target.value)}
                            fullWidth
                          />
                        </MDBox>
                        <MDBox pr={1}>
                          <Autocomplete
                            disablePortal
                            options={teachersList}
                            getOptionLabel={(user) => `${user.name} ${user.surname}`}
                            onChange={(event, value) => setNewTeacher(value ? value._id : "")}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={`${newTeacher.name} ${newTeacher.surname}`}
                              />
                            )}
                          />
                        </MDBox>
                      </MDBox>
                    ) : (
                      <MDBox display="flex" flexDirection="column">
                        <MDBox p={2}>
                          <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                            <MDTypography
                              component="label"
                              variant="h6"
                              fontWeight="medium"
                              color="text"
                            >
                              Name
                            </MDTypography>
                          </MDBox>
                          <MDBox sx={{ overflow: "auto", maxHeight: 250 }}>
                            <MDTypography color="text" variant="body2">
                              {name}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                        {description && (
                          <MDBox p={2}>
                            <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                              <MDTypography
                                component="label"
                                variant="h6"
                                fontWeight="medium"
                                color="text"
                              >
                                Description
                              </MDTypography>
                            </MDBox>
                            <MDBox sx={{ overflow: "auto", maxHeight: 250 }}>
                              <MDTypography color="text" variant="body2">
                                {description}
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        )}
                        <MDBox p={2}>
                          <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                            <MDTypography
                              component="label"
                              variant="h6"
                              fontWeight="medium"
                              color="text"
                            >
                              Teacher
                            </MDTypography>
                          </MDBox>
                          <MDBox sx={{ overflow: "auto", maxHeight: 250 }}>
                            <MDTypography color="text" variant="body2">
                              {teacher.name} {teacher.surname}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    )}
                  </Grid>
                  <Grid item xs={4} lg={2} textAlign="center" display="flex" flexDirection="column">
                    {!edit ? (
                      <MDBox mt={4} mb={1} textAlign="center">
                        <MDButton
                          variant="gradient"
                          color="error"
                          onClick={() => {
                            navigate(-1);
                          }}
                        >
                          Go back
                        </MDButton>
                      </MDBox>
                    ) : (
                      <MDBox mt={4} mb={1} textAlign="center">
                        <MDButton
                          variant="contained"
                          color="success"
                          disabled={!changed || !newName || !newDescription || !newTeacher}
                          onClick={() => handleSubmit()}
                        >
                          Save changes
                        </MDButton>
                      </MDBox>
                    )}

                    <MDBox mt={1} mb={1} textAlign="center">
                      <MDButton
                        variant="contained"
                        color="warning"
                        onClick={() => {
                          setEdit(!edit);
                          setNewName(name);
                          setNewDescription(description);
                          setNewTeacher(teacher);
                        }}
                      >
                        {!edit ? "Edit" : "Cancel"}
                      </MDButton>
                    </MDBox>
                    {edit && (
                      <MDBox mt={1} mb={1} textAlign="center">
                        <MDButton variant="contained" color="error">
                          Delete
                        </MDButton>
                      </MDBox>
                    )}
                  </Grid>
                </Grid>
                <MDBox mt={5}>
                  <MDButton
                    color={manage ? "warning" : "success"}
                    onClick={() => setManage(!manage)}
                  >
                    {manage ? "Cancel" : "Manage members"}
                  </MDButton>

                  {manage ? (
                    <>
                      <MDButton
                        sx={{ marginLeft: 3 }}
                        color="error"
                        disabled={!selectedRowIds.length}
                        onClick={() => handleRemoveMembers()}
                      >
                        Remove selected members
                      </MDButton>
                      <DataTable
                        table={{
                          columns: [
                            {
                              Header: (
                                <MDBox>
                                  <Checkbox onChange={(e) => handleSelectAll(e.target.checked)} />
                                  Select All
                                </MDBox>
                              ),
                              accessor: "checkbox",
                              Cell: ({ row }) => (
                                <Checkbox
                                  checked={row.original.isSelected}
                                  onChange={(e) => {
                                    handleRowSelect(row.original._id, e.target.checked);
                                  }}
                                />
                              ),
                              isCheckbox: true,
                              width: 10,
                            },
                            { Header: "name", accessor: "name" },
                            { Header: "surname", accessor: "surname" },
                            { Header: "studentNumber", accessor: "studentNumber" },
                          ],
                          rows: members,
                        }}
                        entriesPerPage={false}
                        canSearch
                      />
                    </>
                  ) : (
                    <DataTable
                      table={{
                        columns: [
                          { Header: "name", accessor: "name" },
                          { Header: "surname", accessor: "surname" },
                          { Header: "studentNumber", accessor: "studentNumber" },
                        ],
                        rows: members,
                      }}
                      entriesPerPage={false}
                      canSearch
                    />
                  )}
                </MDBox>
              </MDBox>
            ) : (
              <MDBox>No course selected</MDBox>
            )}
          </MDBox>
          {renderSuccessSB}
        </Card>
      </MDBox>
    </PageLayout>
  );
}

export default EditCourse;
