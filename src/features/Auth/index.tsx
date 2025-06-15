import DocStack from "@components/Stack";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl, TextField } from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";
import { loginFormType } from "./types";
import { login } from "./api";
import { useNavigate } from "react-router-dom";

const formSchema = yup.object({
  username: yup.string().required("Username is Required."),
  password: yup.string().required("Password is Required."),
});

const Login = () => {
  const navigate = useNavigate();
  const methods = useForm<loginFormType>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = async (data: loginFormType) => {
    const response = await login(data);
    if (response.status === 200) {
      navigate("/");
    }
  };
  return (
    <DocStack p={2} gap={1}>
      <FormProvider {...methods}>
        <FormControl>
          <Controller
            {...register("username")}
            render={({ field: { ref, ...fieldProps } }) => {
              return (
                <TextField
                  {...fieldProps}
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  inputRef={ref}
                  label="Username"
                />
              );
            }}
          />
        </FormControl>
        <FormControl>
          <Controller
            {...register("password")}
            render={({ field: { ref, ...fieldProps } }) => {
              return (
                <TextField
                  {...fieldProps}
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  inputRef={ref}
                  label="Password"
                />
              );
            }}
          />
        </FormControl>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Login
        </Button>
      </FormProvider>
    </DocStack>
  );
};
export default Login;
