import { Controller, FormProvider, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import { useNavigate } from "react-router-dom";
import DocStack from "@components/Stack";
import { Autocomplete, Button, FormControl, TextField, Typography } from "@mui/material";
import { addTeam, Team } from "./teamSlice";

type TeamFormData = Omit<Team, "id">;

const formSchema = yup.object({
  name: yup.string().required("Name is Required."),
  playerIds: yup.array().of(yup.string().required()).min(1).required(),
  captainId: yup.string().required(),
});

const TeamForm = () => {
  const players = useAppSelector((store) => store.player.players);
  const playersIds = players.map((p) => p.id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const methods = useForm<TeamFormData>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      playerIds: [],
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
    dispatch(addTeam(data));
    navigate("/teams");
  };

  const selectedPlayerIds = watch("playerIds");

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
            {...register("playerIds")}
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
                  getOptionLabel={(o) => players.find((p) => p.id === o)?.name || ""}
                  renderInput={(param) => (
                    <TextField
                      {...param}
                      error={!!errors.playerIds}
                      helperText={errors.playerIds?.message}
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
                  getOptionLabel={(o) => players.find((p) => p.id === o)?.name || ""}
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
