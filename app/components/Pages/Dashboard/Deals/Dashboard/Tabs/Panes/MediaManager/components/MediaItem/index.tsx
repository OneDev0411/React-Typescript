import React, { useState } from "react";
import { Typography, Box } from "@material-ui/core";

import ActionsMenu from "./ActionsMenu";
import SelectCheckbox from "./SelectCheckbox";

import { useStyles } from "../../styles";

interface Props {}

export default function MediaItem() {
  const classes = useStyles();

  return (
    <Box className={classes.mediaCard}>
      <Box className={classes.mediaThumbnailContainer}>
        <img
          src="https://placeimg.com/300/250/arch"
          className={classes.mediaThumbnail}
          alt=""
        />
        <SelectCheckbox />
        <ActionsMenu />
      </Box>
      <Typography variant="body1" className={classes.trimmedText}>
        This flexibility allows integrating React into projects with existing
        conventions. But it also invites endless debates.
      </Typography>
    </Box>
  );
}
