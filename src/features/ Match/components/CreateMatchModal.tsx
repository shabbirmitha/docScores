import DocStack from "@components/Stack";
import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  Modal,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import * as yup from "yup";
import { Team } from "@features/Team/teamTypes";
import { MatchView } from "../matchTypes";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useMatchesData from "../useMatchesData";
import useTeamsData from "@features/Team/useTeamsData";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const formSchema = yup.object({
  teamA: yup.mixed<Team["id"]>().required(),
  teamB: yup.mixed<Team["id"]>().required(),
  type: yup.mixed<MatchView.Match["type"]>().required(),
});

const MATCH_TYPE_MAP = [
  MatchView.MatchType.T10,
  MatchView.MatchType.T20,
  MatchView.MatchType.ONE_DAY,
  MatchView.MatchType.TEST,
];

const MATCH_TYPE_LABEL_MAP = {
  [MatchView.MatchType.T10]: "T10",
  [MatchView.MatchType.T20]: "T20",
  [MatchView.MatchType.ONE_DAY]: "One Day",
  [MatchView.MatchType.TEST]: "Test",
};

type CreateMatchModalProps = {
  open: boolean;
  onClose: () => void;
};

type formDataType = {
  teamA: Team["id"];
  teamB: Team["id"];
  type: MatchView.MatchType;
};

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ open, onClose }) => {
  const { addMatch } = useMatchesData();

  const methods = useForm<formDataType>({
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = methods;

  const { teams } = useTeamsData();
  const teamIds = teams?.map((t) => t._id) || [];

  const teamA = watch("teamA");
  const teamB = watch("teamB");

  const handleCreateMatch = (data: formDataType) => {
    const { teamA, teamB, type } = data;
    if (!!teamA && !!teamB && !!type) {
      const teams = [teamA, teamB];
      addMatch({ teams, type });
      reset();
      onClose?.();
    }
  };
  return (
    <StyledModal open={open} onClose={onClose}>
      <DocStack width={400} p={2} gap={1} bgcolor={"secondary.main"} borderRadius={2}>
        <DocStack>
          <Typography fontSize={"large"} fontWeight={"bold"}>
            Create Match
          </Typography>
        </DocStack>
        <DocStack width={"-webkit-fill-available"} gap={1}>
          <FormProvider {...methods}>
            <FormControl>
              <Controller
                {...register("teamA")}
                render={({ field: fieldProps }) => (
                  <Autocomplete
                    {...fieldProps}
                    onChange={(_, v) => fieldProps.onChange(v)}
                    fullWidth
                    getOptionLabel={(o) => teams?.find((t) => t._id === o)?.name || "Unknown Team"}
                    options={teamIds.filter((t) => t !== teamB)}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.teamA}
                        helperText={errors.teamA?.message}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
            <Divider>
              <Typography>VS</Typography>
            </Divider>
            <FormControl>
              <Controller
                {...register("teamB")}
                render={({ field: fieldProps }) => (
                  <Autocomplete
                    {...fieldProps}
                    onChange={(_, v) => fieldProps.onChange(v)}
                    fullWidth
                    getOptionLabel={(o) => teams?.find((t) => t._id === o)?.name || "Unknown Team"}
                    options={teamIds.filter((t) => t !== teamA)}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.teamB}
                        helperText={errors.teamB?.message}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <Controller
                {...register("type")}
                render={({ field: fieldProps }) => (
                  <Autocomplete
                    {...fieldProps}
                    onChange={(_, v) => fieldProps.onChange(v)}
                    fullWidth
                    disableClearable
                    options={MATCH_TYPE_MAP}
                    getOptionLabel={(o: MatchView.MatchType) => MATCH_TYPE_LABEL_MAP[o]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.type}
                        helperText={errors.type?.message}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
            <Button fullWidth variant="contained" onClick={handleSubmit(handleCreateMatch)}>
              Create Match
            </Button>
          </FormProvider>
        </DocStack>
      </DocStack>
    </StyledModal>
  );
};

export default CreateMatchModal;
