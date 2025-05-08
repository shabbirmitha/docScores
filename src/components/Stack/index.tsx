import { Stack, StackProps } from "@mui/material";
import React, { PropsWithChildren } from "react";

export type DocStackProps = StackProps;
const DocStack: React.FC<PropsWithChildren<DocStackProps>> = ({ children, ...props }) => (
  <Stack {...props}>{children}</Stack>
);
export default DocStack;
