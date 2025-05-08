import DocStack from "@components/Stack";
import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  Modal,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store";
import { useEffect, useState } from "react";
import { addBall, MatchView, newPlayersInAction } from "./matchSlice";
import { Controller, FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Player } from "features/Player/playerSlice";

const StyledScoreCard = styled(DocStack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  gap: theme.spacing(2),
}));
const StyledPanelCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}));

const WICKET_MAP = [
  MatchView.WicketType.CAUGHT,
  MatchView.WicketType.BOWLED,
  MatchView.WicketType.RUN_OUT,
  MatchView.WicketType.LBW,
  MatchView.WicketType.STUMPED,
  MatchView.WicketType.HIT_WICKET,
  MatchView.WicketType.RETIRED_HURT,
  MatchView.WicketType.RETIRED_OUT,
  MatchView.WicketType.OBSTRUCTING_FIELD,
];

const WICKET_LABEL_MAP = {
  [MatchView.WicketType.CAUGHT]: "Caught",
  [MatchView.WicketType.BOWLED]: "Bowled",
  [MatchView.WicketType.RUN_OUT]: "Run Out",
  [MatchView.WicketType.LBW]: "LBW",
  [MatchView.WicketType.STUMPED]: "Stumped",
  [MatchView.WicketType.HIT_WICKET]: "Hit Wicket",
  [MatchView.WicketType.RETIRED_HURT]: "Retired Hurt",
  [MatchView.WicketType.RETIRED_OUT]: "Retired Out",
  [MatchView.WicketType.OBSTRUCTING_FIELD]: "Obstructing Field",
};

const EXTRAS_MAP = [
  MatchView.ExtraType.WIDES,
  MatchView.ExtraType.NO_BALLS,
  MatchView.ExtraType.BYES,
  MatchView.ExtraType.LEG_BYES,
];

const EXTRAS_LABEL_MAP = {
  [MatchView.ExtraType.WIDES]: "Wides",
  [MatchView.ExtraType.NO_BALLS]: "No Balls",
  [MatchView.ExtraType.BYES]: "Byes",
  [MatchView.ExtraType.LEG_BYES]: "Leg Byes",
};

const SHORT_BALL_LABEL_MAP = {
  [MatchView.ExtraType.WIDES]: "Wd",
  [MatchView.ExtraType.NO_BALLS]: "Nb",
  [MatchView.ExtraType.BYES]: "B",
  [MatchView.ExtraType.LEG_BYES]: "Lb",
  Wicket: "W",
};

const formSchema = yup.object({
  runs: yup.number().required("Runs is Required."),
  isExtra: yup.boolean().default(false),
  isWicket: yup.boolean().default(false),
  extraType: yup
    .mixed<MatchView.ExtraType>()
    .oneOf(EXTRAS_MAP, "Invalid Extra Type.")
    .when("isExtra", {
      is: true,
      then: (schema) => schema.required("Extra Type is Required."),
      otherwise: (schema) => schema.nullable().notRequired(),
    })
    .default(null),
  extraRuns: yup
    .number()
    .when("isExtra", {
      is: true,
      then: (schema) => schema.required("Extra Runs is Required."),
      otherwise: (schema) => schema.nullable().notRequired(),
    })
    .default(null),
  wicketType: yup
    .mixed<MatchView.WicketType>()
    .oneOf(WICKET_MAP, "Invalid Wicket Type.")
    .when("isWicket", {
      is: true,
      then: (schema) => schema.required("Wicket Type is Required."),
      otherwise: (schema) => schema.nullable().notRequired(),
    })
    .default(null),
  fielderId: yup.string().nullable().default(null),
  playerOut: yup
    .mixed<"strikerId" | "nonStrikerId">()
    .oneOf(["strikerId", "nonStrikerId"], "Invalid Player")
    .when("isWicket", {
      is: true,
      then: (schema) => schema.required("Player is Required."),
      otherwise: (schema) => schema.nullable().notRequired(),
    })
    .default(null),
});

const MatchPlay = () => {
  const dispatch = useAppDispatch();
  const [onCrease, setOnCrease] = useState<{
    bowlerId?: Player["id"];
    strikerId?: Player["id"];
    nonStrikerId?: Player["id"];
  }>();
  const matchId = new URLSearchParams(window.location.search).get("matchId");
  const matches = useAppSelector((state) => state.match.matches);
  const players = useAppSelector((state) => state.player.players);

  const match = matches.find((m) => m.id === matchId)!;

  const {
    runs,
    wickets,
    overs,
    battingTeam: _battingTeam,
    bowlingTeam: _bowlingTeam,
    strikerId,
    nonStrikerId,
    currentRunRate,
  }: MatchView.Inning = match.innings[match.currentInnings];
  const over = overs.length > 0 ? overs.length - 1 : 0;

  const balls = overs[over].balls.length > 0 ? overs[over].balls : null;

  const ballsLeft = overs[over].ballsLeft ? 6 - overs[over].ballsLeft : 0;

  const bowlerId = overs[over].bowlerId;
  const bowler = players.find((p) => p.id === bowlerId);

  const striker = players.find((p) => p.id === strikerId);

  const nonStriker = players.find((p) => p.id === nonStrikerId);

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(formSchema),
    defaultValues: {
      runs: 0,
      isExtra: false,
      isWicket: false,
      extraRuns: 0,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = methods;

  const wicketType = watch("wicketType");

  const isFielderInvolved =
    wicketType === MatchView.WicketType.CAUGHT || wicketType === MatchView.WicketType.RUN_OUT;

  const handleSubmitBall = (
    data: MatchView.CurrentBall & { playerOut: "strikerId" | "nonStrikerId" }
  ) => {
    if (matchId) {
      const newBall: MatchView.CurrentBall = {
        runs: data.runs,
        isWicket: data.isWicket,
        wicketType: data.isWicket ? data.wicketType : null,
        fielderId: data.isWicket ? data.fielderId : null,
        isExtra: data.isExtra,
        extraType: data.isExtra ? data.extraType : null,
        extraRuns: data.isExtra ? data.extraRuns : 0,
      };
      dispatch(addBall({ matchId: matchId, ball: newBall, outOnEnd: data.playerOut }));
      if (data.runs % 2 === 1) {
        setOnCrease((prev) => ({
          ...prev,
          strikerId: onCrease?.nonStrikerId,
          nonStrikerId: onCrease?.strikerId,
        }));
      }
      reset();
    }
  };

  const [open, setOpen] = useState(false);

  const handleSelect = () => {
    if (matchId && onCrease?.bowlerId && onCrease?.strikerId) {
      dispatch(
        newPlayersInAction({
          matchId,
          bowlerId: onCrease?.bowlerId,
          strikerId: !strikerId ? onCrease?.strikerId : undefined,
          nonStrikerId: !nonStrikerId ? onCrease?.nonStrikerId : undefined,
        })
      );
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!bowler || !nonStriker || !striker) {
      setOpen(true);
    }
  }, [bowler, striker, nonStriker]);

  const strikerStats = _battingTeam.players.find((p) => p.playerId === strikerId);
  const nonStrikerStats = _battingTeam.players.find((p) => p.playerId === nonStrikerId);

  const bowlerStats = _bowlingTeam.players.find((p) => p.playerId === bowlerId);

  const playersToBat = _battingTeam.players
    .filter((p) => !p.out && p.playerId !== strikerId && p.playerId !== nonStrikerId)
    .map((p) => p.playerId);

  const bowlersToBowl = _bowlingTeam.players
    .filter((p) => p.playerId !== overs[over]?.bowlerId)
    .map((p) => p.playerId);

  const fieldersId = _bowlingTeam.players
    .filter((p) => p.playerId !== bowlerId)
    .map((p) => p.playerId);

  const getOverBallsText = (ball: MatchView.CurrentBall) => {
    const runText = ball.isWicket ? (ball.runs >= 1 ? `${ball.runs}+` : "") : ball.runs;
    const extraText = ball.extraType ? SHORT_BALL_LABEL_MAP[ball.extraType] : "";
    const wicketText = ball.isWicket ? SHORT_BALL_LABEL_MAP.Wicket : "";

    return `${runText}${extraText}${wicketText}`;
  };

  const bowlersBalled = _bowlingTeam.players.filter((p) => p.ballBowled > 0);

  const batsmanBatted = _battingTeam.players.filter(
    (p) => p.balls > 0 || p.playerId === strikerId || p.playerId === nonStrikerId
  );

  return (
    <DocStack py={1} gap={1}>
      <DocStack flexDirection={"row"} alignItems={"center"}>
        <Typography style={{ flex: 1 }}>MatchPlay</Typography>
      </DocStack>
      <DocStack flexDirection={"row"} gap={1} bgcolor={"primary.main"} p={1} borderRadius={2}>
        <StyledPanelCard>
          {(!bowlerId || !nonStrikerId || !strikerId) && (
            <Modal
              open={open}
              sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <DocStack width={400} gap={1} p={2} bgcolor={"secondary.main"} borderRadius={2}>
                <Typography variant="h6">Select</Typography>
                {!bowlerId && (
                  <Autocomplete
                    disableClearable
                    autoFocus
                    value={onCrease?.bowlerId}
                    fullWidth
                    onChange={(e, value) => {
                      setOnCrease((prev) => ({ ...prev, bowlerId: value }));
                    }}
                    options={bowlersToBowl}
                    getOptionLabel={(option: Player["id"]) => {
                      const playerId = _bowlingTeam.players.find(
                        (p) => p.playerId === option
                      )?.playerId;
                      const player = players.find((p) => p.id === playerId);
                      return player ? player.name : "Unknown Player";
                    }}
                    renderInput={(params) => <TextField {...params} label="Select Bowler" />}
                  />
                )}
                {!strikerId && (
                  <Autocomplete
                    disableClearable
                    autoFocus
                    value={onCrease?.strikerId}
                    fullWidth
                    onChange={(e, value) => {
                      setOnCrease((prev) => ({ ...prev, strikerId: value }));
                    }}
                    options={playersToBat}
                    getOptionLabel={(option: Player["id"]) => {
                      const player = players.find((p) => p.id === option);
                      return player ? player.name : "Unknown Player";
                    }}
                    renderInput={(params) => <TextField {...params} label="Select Striker" />}
                  />
                )}
                {!nonStriker && (
                  <Autocomplete
                    disableClearable
                    autoFocus
                    value={onCrease?.nonStrikerId}
                    fullWidth
                    onChange={(e, value) => {
                      setOnCrease((prev) => ({ ...prev, nonStrikerId: value }));
                    }}
                    options={playersToBat.filter((id) => id !== onCrease?.strikerId)}
                    getOptionLabel={(option: Player["id"]) => {
                      const player = players.find((p) => p.id === option);
                      return player ? player.name : "Unknown Player";
                    }}
                    renderInput={(params) => <TextField {...params} label="Select Non Striker" />}
                  />
                )}
                <Button variant="contained" onClick={handleSelect}>
                  Select
                </Button>
              </DocStack>
            </Modal>
          )}

          <FormProvider {...methods}>
            {/* Title */}
            <DocStack gap={1}>
              <Typography variant="h6" color="primary.main">
                Panel
              </Typography>
            </DocStack>

            {/* Runs */}
            <DocStack gap={1}>
              <FormControl>
                <Controller
                  {...register("runs")}
                  render={({ field: { ...fieldProps } }) => {
                    return (
                      <Autocomplete
                        {...fieldProps}
                        fullWidth
                        onChange={(e, value) => fieldProps.onChange(value)}
                        disableClearable
                        options={[...Array(7).keys()]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Runs"
                            error={!!errors.runs}
                            helperText={errors.runs?.message}
                          />
                        )}
                      />
                    );
                  }}
                />
              </FormControl>
            </DocStack>

            {/* isExtra */}
            <DocStack gap={1}>
              <FormControl>
                <Controller
                  {...register("isExtra")}
                  render={({ field: { ...fieldProps } }) => {
                    return (
                      <DocStack flexDirection={"row"} alignItems={"center"}>
                        <Checkbox {...fieldProps} checked={fieldProps.value} />
                        <Typography>Is Extra ?</Typography>
                      </DocStack>
                    );
                  }}
                />
              </FormControl>
              <DocStack flexDirection={"row"} gap={1}>
                <FormControl fullWidth>
                  <Controller
                    {...register("extraType")}
                    render={({ field: { ...fieldProps } }) => {
                      return (
                        <Autocomplete
                          {...fieldProps}
                          disableClearable
                          onChange={(e, value) => fieldProps.onChange(value)}
                          disabled={!watch("isExtra")}
                          options={EXTRAS_MAP}
                          getOptionLabel={(option: MatchView.ExtraType) => EXTRAS_LABEL_MAP[option]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Extra Type"
                              error={!!errors.extraType}
                              helperText={errors.extraType?.message}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    {...register("extraRuns")}
                    render={({ field: { ...fieldProps } }) => {
                      return (
                        <TextField
                          {...fieldProps}
                          disabled={!watch("isExtra")}
                          label="Extra Runs"
                          error={!!errors.extraRuns}
                          helperText={errors.extraRuns?.message}
                        />
                      );
                    }}
                  />
                </FormControl>
              </DocStack>
            </DocStack>

            {/* isWicket */}
            <DocStack gap={1}>
              <FormControl>
                <Controller
                  {...register("isWicket")}
                  render={({ field: { ...fieldProps } }) => {
                    return (
                      <DocStack flexDirection={"row"} alignItems={"center"}>
                        <Checkbox {...fieldProps} checked={fieldProps.value} />
                        <Typography>Is Wicket ?</Typography>
                      </DocStack>
                    );
                  }}
                />
              </FormControl>
              <DocStack flexDirection={"row"} gap={1}>
                <FormControl fullWidth>
                  <Controller
                    {...register("wicketType")}
                    render={({ field: { ...fieldProps } }) => {
                      return (
                        <Autocomplete
                          {...fieldProps}
                          disableClearable
                          disabled={!watch("isWicket")}
                          onChange={(e, value) => fieldProps.onChange(value)}
                          options={WICKET_MAP}
                          getOptionLabel={(option: MatchView.WicketType) =>
                            WICKET_LABEL_MAP[option]
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Wicket Type"
                              error={!!errors.wicketType}
                              helperText={errors.wicketType?.message}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    {...register("playerOut")}
                    render={({ field: { ...fieldProps } }) => {
                      return (
                        <Autocomplete
                          {...fieldProps}
                          disabled={!watch("isWicket")}
                          options={["strikerId", "nonStrikerId"]}
                          onChange={(_, value) => fieldProps.onChange(value)}
                          getOptionLabel={(option) => {
                            console.log("option", option);
                            console.log("onCrease", onCrease);
                            const playerId = onCrease?.[option as keyof typeof onCrease];
                            console.log("playerId", playerId);
                            return players.find((p) => p.id === playerId)?.name || "Unknown Player";
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Batsman Out"
                              error={!!errors.playerOut}
                              helperText={errors.playerOut?.message}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </FormControl>
              </DocStack>
              {!!isFielderInvolved && watch("isWicket") && (
                <FormControl fullWidth>
                  <Controller
                    {...register("fielderId")}
                    render={({ field: { ...fieldProps } }) => {
                      return (
                        <Autocomplete
                          {...fieldProps}
                          disabled={!watch("isWicket") && !isFielderInvolved}
                          options={fieldersId}
                          getOptionLabel={(option) =>
                            players.find((p) => p.id === option)?.name || ""
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Fielder"
                              error={!!errors.fielderId}
                              helperText={errors.fielderId?.message}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </FormControl>
              )}
            </DocStack>

            <Divider sx={{ my: 0.5 }} />
            {/* Submit */}
            <DocStack
              gap={1}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Button variant="contained" color="primary" onClick={handleSubmit(handleSubmitBall)}>
                Submit
              </Button>
              <DocStack alignItems={"flex-end"}>
                <Typography variant="caption">Over: 0.0</Typography>
                <Typography variant="caption">Score: 0-0</Typography>
              </DocStack>
            </DocStack>
          </FormProvider>
        </StyledPanelCard>
      </DocStack>

      <StyledScoreCard>
        <DocStack flex={2} color={"secondary.main"} gap={1}>
          <DocStack flexDirection={"row"} justifyContent={"space-between"}>
            <Typography variant="subtitle2" fontWeight="bold">
              {striker?.name} *
            </Typography>
            <DocStack flexDirection={"row"} gap={0.2} alignItems={"flex-end"}>
              <Typography variant="subtitle2">
                {strikerStats && strikerStats.runs ? strikerStats.runs : 0}
              </Typography>
              <Typography variant="caption">
                {strikerStats && strikerStats.balls ? strikerStats.balls : 0}
              </Typography>
            </DocStack>
          </DocStack>
          <DocStack flexDirection={"row"} justifyContent={"space-between"}>
            <Typography variant="subtitle2" fontWeight="bold">
              {nonStriker?.name}
            </Typography>
            <DocStack flexDirection={"row"} gap={0.2} alignItems={"flex-end"}>
              <Typography variant="subtitle2">
                {nonStrikerStats && nonStrikerStats.runs ? nonStrikerStats.runs : 0}
              </Typography>
              <Typography variant="caption">
                {nonStrikerStats && nonStrikerStats.balls ? nonStrikerStats.balls : 0}
              </Typography>
            </DocStack>
          </DocStack>
        </DocStack>
        <DocStack flex={1}>
          <DocStack
            bgcolor={"secondary.main"}
            color={"primary.main"}
            alignItems={"center"}
            justifyContent={"center"}
            borderRadius={2}
          >
            <Typography>
              {runs}-{wickets}
            </Typography>
            <Typography>
              {over}.{ballsLeft}
            </Typography>
          </DocStack>
          <DocStack
            color={"secondary.main"}
            alignItems={"center"}
            height={20}
            justifyContent={"center"}
          >
            {!!currentRunRate && (
              <Typography variant="caption">{`CRR:${currentRunRate}`}</Typography>
            )}
          </DocStack>
        </DocStack>
        <DocStack flex={2} gap={1}>
          {!!bowler && (
            <DocStack
              flexDirection={"row"}
              gap={1}
              justifyContent={"flex-end"}
              color={"secondary.main"}
              alignItems={"center"}
            >
              <Typography variant="subtitle2">{bowler?.name}</Typography>
              <Chip
                label={`${bowlerStats?.wickets}-${bowlerStats?.runsConceded} | ${bowlerStats && bowlerStats.ballBowled > 0 ? ballsToOvers(bowlerStats?.ballBowled) : 0.0}`}
                color="secondary"
                variant="filled"
                size="small"
                style={{ borderRadius: 8 }}
              />
            </DocStack>
          )}
          <DocStack flexDirection={"row"} gap={1} height={32}>
            {balls &&
              balls.map((ball, index) => (
                <Chip
                  key={index}
                  color="secondary"
                  variant={
                    ball.runs === 4 || ball.runs === 6 || ball.isWicket ? "filled" : "outlined"
                  }
                  style={{ borderRadius: 8 }}
                  label={getOverBallsText(ball)}
                />
              ))}
          </DocStack>
        </DocStack>
      </StyledScoreCard>

      <DocStack flexDirection={"row"} gap={1}>
        {/* Batsmen Stats */}
        {batsmanBatted.length > 0 && (
          <DocStack
            color={"primary.main"}
            bgcolor={"secondary.main"}
            width={"fit-content"}
            borderRadius={2}
            p={1.5}
          >
            <DocStack flexDirection={"row"} justifyContent={"space-between"}>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Batsmen :
              </Typography>
              <DocStack flexDirection={"row"} gap={2} width={130}>
                <Typography>R</Typography>
                <Typography>B</Typography>
                <Typography>4</Typography>
                <Typography>6</Typography>
                <Typography>S/R</Typography>
              </DocStack>
            </DocStack>

            {batsmanBatted.map((_pl) => {
              const player = players.find((p) => p.id === _pl.playerId);
              return (
                <DocStack flexDirection={"row"} gap={5} justifyContent={"space-between"}>
                  <Typography variant="subtitle2">{player?.name}</Typography>
                  <DocStack flexDirection={"row"} gap={2} width={160}>
                    <Typography>{_pl.runs}</Typography>
                    <Typography>{_pl.balls}</Typography>
                    <Typography>{_pl.fours}</Typography>
                    <Typography>{_pl.sixes}</Typography>
                    <Typography>{_pl.strikeRate}</Typography>
                  </DocStack>
                </DocStack>
              );
            })}
          </DocStack>
        )}
        {/* Bowlers Stats */}
        {bowlersBalled.length > 0 && (
          <DocStack
            color={"primary.main"}
            bgcolor={"secondary.main"}
            width={"fit-content"}
            borderRadius={2}
            p={1.5}
          >
            <DocStack flexDirection={"row"} justifyContent={"space-between"}>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Bowlers :
              </Typography>
              <DocStack flexDirection={"row"} gap={2} width={130}>
                <Typography>O</Typography>
                <Typography>R</Typography>
                <Typography>W</Typography>
                <Typography>Eco</Typography>
              </DocStack>
            </DocStack>

            {bowlersBalled.map((_pl) => {
              const player = players.find((p) => p.id === _pl.playerId);
              return (
                <DocStack flexDirection={"row"} gap={5} justifyContent={"space-between"}>
                  <Typography variant="subtitle2">{player?.name}</Typography>
                  <DocStack flexDirection={"row"} gap={2} width={130}>
                    <Typography>{ballsToOvers(_pl.ballBowled)}</Typography>
                    <Typography>{_pl.runsConceded}</Typography>
                    <Typography>{_pl.wickets}</Typography>
                    <Typography>{_pl.economy}</Typography>
                  </DocStack>
                </DocStack>
              );
            })}
          </DocStack>
        )}
      </DocStack>
    </DocStack>
  );
};

function ballsToOvers(balls: number): number {
  const fullOvers = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return parseFloat(`${fullOvers}.${remainingBalls}`);
}

export default MatchPlay;
