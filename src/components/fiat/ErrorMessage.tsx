import { Typography } from "@material-ui/core";
import React from "react";

const ErrorMessage = ({ children }: { children: any }) => {
  return (
    <Typography align="center" color="error">
      {children}
    </Typography>
  );
};

export default ErrorMessage;
