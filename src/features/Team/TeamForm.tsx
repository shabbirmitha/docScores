import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import { useNavigate } from "react-router-dom";
import DocStack from "@components/Stack";
import { Autocomplete, Button, FormControl, TextField, Typography } from "@mui/material";
import { Team } from "./teamSlice";
import usePlayersData from "@features/Player/usePlayersData";
import useTeamsData from "./useTeamsData";

type TeamFormData = Omit<Team, "id" | "_id">;

const formSchema = yup.object({
  name: yup.string().required("Name is Required."),
  playersId: yup.array().of(yup.string().required()).min(1).required(),
  captainId: yup.string().required(),
});

const TeamForm = () => {
  const { players } = usePlayersData();
  const playersIds = players?.map((p) => p._id) || [];

  const { addTeam } = useTeamsData();

  const navigate = useNavigate();
  const methods = useForm<TeamFormData>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      playersId: [],
      captainId: "",
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const onSubmit = (data: TeamFormData) => {
    // dispatch(addTeam(data));
    addTeam(data);
    navigate("/teams");
  };

  const selectedPlayerIds = watch("playersId");

  return (
    <DocStack gap={1}>
      <Typography variant="h6" gutterBottom>
        Add New Team
      </Typography>
      <FormProvider {...methods}>
        <FormControl>
          <Controller
            {...register("name")}
            render={({ field: { ref, ...fieldProps } }) => {
              return (
                <TextField
                  {...fieldProps}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  inputRef={ref}
                  label="Team Name"
                />
              );
            }}
          />
        </FormControl>
        <FormControl>
          <Controller
            {...register("playersId")}
            render={({ field: { ref, ...fieldProps } }) => {
              return (
                <Autocomplete
                  {...fieldProps}
                  fullWidth
                  multiple
                  options={playersIds}
                  onChange={(_, v) => {
                    fieldProps.onChange(v);
                  }}
                  disableCloseOnSelect
                  getOptionLabel={(o) => players?.find((p) => p._id === o)?.name || ""}
                  renderInput={(param) => (
                    <TextField
                      {...param}
                      error={!!errors.playersId}
                      helperText={errors.playersId?.message}
                      inputRef={ref}
                      label="Players"
                    />
                  )}
                />
              );
            }}
          />
        </FormControl>
        <FormControl>
          <Controller
            {...register("captainId")}
            render={({ field: { ref, ...fieldProps } }) => {
              return (
                <Autocomplete
                  {...fieldProps}
                  fullWidth
                  options={selectedPlayerIds}
                  onChange={(_, v) => {
                    fieldProps.onChange(v);
                  }}
                  getOptionLabel={(o) => players?.find((p) => p._id === o)?.name || ""}
                  renderInput={(param) => (
                    <TextField
                      {...param}
                      error={!!errors.captainId}
                      helperText={errors.captainId?.message}
                      inputRef={ref}
                      label="Captain"
                    />
                  )}
                />
              );
            }}
          />
        </FormControl>

        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </FormProvider>
    </DocStack>
  );
};

export default TeamForm;
