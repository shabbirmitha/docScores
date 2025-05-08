import { Controller, FormProvider, useForm } from "react-hook-form";
import { useAppDispatch } from "../../store";
import { yupResolver } from "@hookform/resolvers/yup";
import { addPlayer, Player, PLAYER_ROLE } from "./playerSlice";

import * as yup from "yup";

import { useNavigate } from "react-router-dom";
import DocStack from "@components/Stack";
import { Button, FormControl, MenuItem, TextField, Typography } from "@mui/material";

type PlayerFormData = Omit<Player, "id">;

const formSchema = yup.object({
  name: yup.string().required("Name is Required."),
  role: yup
    .mixed<Player["role"]>()
    .oneOf(Object.values(PLAYER_ROLE), "Invalid Role")
    .required("Role is required"),
});

const PlayerForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const methods = useForm<PlayerFormData>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      role: PLAYER_ROLE.BATSMAN,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: PlayerFormData) => {
    dispatch(addPlayer(data));
    navigate("/players");
  };
  return (
    <DocStack gap={1}>
      <Typography variant="h6" gutterBottom>
        Add New Player
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
                  label="Player Name"
                />
              );
            }}
          />
        </FormControl>
        <FormControl>
          <Controller
            {...register("role")}
            render={({ field: { ref, ...fieldProps } }) => {
              return (
                <TextField
                  {...fieldProps}
                  fullWidth
                  select
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  inputRef={ref}
                  label="Role"
                >
                  {Object.values(PLAYER_ROLE).map((role) => (
                    <MenuItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
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

export default PlayerForm;
