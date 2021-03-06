import React, { useState, useEffect } from "react";
import fetchData from "../utils/fetchData";
import clsx from "clsx";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Spellcheck from "@material-ui/icons/Spellcheck";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PlayArrow from '@material-ui/icons/PlayArrow';
import PanTool from '@material-ui/icons/PanTool';

const useStyles = makeStyles(theme => ({
  root: {
    "& label.MuiFormLabel-root.Mui-disabled": {
      fontSize: 22,
      color: "#8a9696"
    },
    maxWidth: 345,
    backgroundColor: "#d3cbbd",
    color: "#2d2d2d",
    boxShadow: "none",
    fontFamily : 'PT Sans Narrow'
    // border : "1px solid #9a958f",
  },
  reportButton: {
    marginLeft: "auto",
    borderRadius: 5,
    fontSize: 18,
    color: theme.palette.getContrastText("#9a958f")
  },
  expand: {
    borderRadius: 5,
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    borderRadius: 5,
    transform: "rotate(180deg)"
  },
  marginBottom: {
    "& > label, &.Mui-disabled > label": {
      fontSize: 17,
      color: "#c14677",
      fontFamily : 'PT Sans Narrow'
    },
    "& input" : {
      color : "#4d4d4d",
      
    },
    "& div:after,& div:before" : {
      borderBottom: "0 none"
    },
    marginBottom: 5,
    borderBottom: "none",
    fontFamily : 'PT Sans Narrow !important',
    fontSize : 14,
  },
  avatar: {
    fontSize: 45,
    backgroundColor: "transparent",
    fontFamily: "Bungee Inline",
    color: "#2c6c83"
  },
  pencil: {
    '&:hover' : {
      color : "#4d4229"
    },
    backgroundColor: "transparent",
    color: "#9e937d",
    padding: 3,
    borderRadius : 3,
    fontSize : 17,
    marginTop : 10
  }
}));

const StartButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText("#3d938b"),
    fontFamily : 'PT Sans Narrow',
    backgroundColor: "#3d938b",
    "&:hover": {
      backgroundColor: "#3c896b"
    }
  }
}))(Button);
const StopButton = withStyles(theme => ({
  root: {
    fontFamily : 'PT Sans Narrow',
    color: theme.palette.getContrastText("#98515f"),
    backgroundColor: "#98515f",
    "&:hover": {
      backgroundColor: "#c8515f"
    }
  }
}))(Button);

const DashboardItem = ({ botDataObj }) => {
  const [botState, setBotState] = useState(true);
  const [botData, setBotData] = useState(botDataObj);
  const [editState, setEditState] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [report, setReport] = useState([]);

  useEffect(() => {
    setBotData({ ...botDataObj });
  }, [botDataObj]);

  const classes = useStyles();

  const editStrategy = () => {
    setEditState(!editState);
    setBotState(false);
  };

  const handleExpandClick = () => {
    fetchData("http://mm.mvsfans.org:10082/api/strategies/query/report", {
      uuid: botData.threadUuid,
      startTimestamp: 1583038800,
      endTimestamp: 1583209945
    }).then(report => {
      setReport(report);
    });
    setExpanded(!expanded);
  };

  const handleBotChange = e => {
    if (e.target.value) {
      let obj = {};
      obj[e.target.id] = e.target.value;
      setBotData({
        ...botData,
        threadConfig: { ...botData.threadConfig, ...obj }
      });
    }
  };

  const save = () => setEditState(false);

  const stopBot = async () => {
    setButtonLoading(true);

    fetchData(
      "http://mm.mvsfans.org:10082/api/strategies/stop/maker/order/book/near",
      {
        uuid: botData.threadUuid,
        cancelOrders: true
      }
    ).then(result => {
      console.log(result);
      setBotState(false);
      setButtonLoading(false);
      setBotData({ ...botData, threadIsRunning: false });
    });
  };

  const startBot = async () => {
    setButtonLoading(true);

    fetchData(
      "http://mm.mvsfans.org:10082/api/strategies/start/maker/order/book/near",
      {
        ...botData.threadConfig
      }
    ).then(result => {
      setBotState(true);
      setButtonLoading(false);
    });

    return true;
  };

  return (
    <Grid item xs={12} md={4}>
      <Card
        className={`${classes.root} ${botState ? "bot-running" : "bot-paused"}`}
      >
        <CardHeader
          avatar={
            <Avatar className={classes.avatar} aria-label="recipe">
              {botData.threadStrategy}
            </Avatar>
          }
          action={
            !editState ? (
              <Spellcheck
                className={classes.pencil}
                fontSize="small"
                onClick={editStrategy}
              />
            ) : null
          }
          titleTypographyProps={{ variant: "h5" }}
          title={`${botData.threadConfig.base} / ${botData.threadConfig.counter}`}
          subheader={`${botData.threadUuid}`}
        />
        {/* <CardMedia
          component="img"
          alt="Crypto Dashboard"
          height="140"
          image={MetaverseImage}
          title="Contemplative Reptile"
        /> */}
        <CardContent>
          <TextField
            fullWidth
            className={classes.marginBottom}
            label="Exchange Name"
            id="exchangeName"
            size="small"
            defaultValue={botData.threadConfig.exchangeName}
            disabled={editState ? false : true}
          />
          <TextField
            fullWidth
            className={classes.marginBottom}
            label="API Key"
            id="apiKey"
            defaultValue={botData.threadConfig.apiKey}
            size="small"
            disabled={editState ? false : true}
          />
          <TextField
            fullWidth
            className={classes.marginBottom}
            label="Signature"
            defaultValue={botData.threadConfig.signature}
            id="signature"
            size="small"
            disabled={editState ? false : true}
          />

          <TextField
            fullWidth
            className={classes.marginBottom}
            id="threadStartTime"
            size="small"
            label="Trading Since"
            defaultValue={new Date(botData.threadStartTime)}
            disabled={editState ? false : true}
          />
          <TextField
            fullWidth
            className={classes.marginBottom}
            size="small"
            id="threadEndTime"
            label="End Time"
            defaultValue={
              botData.threadEndTime
                ? new Date(botData.threadEndTime)
                : `Ongoing Bot`
            }
            disabled={editState ? false : true}
          />
        </CardContent>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Followed Exchange Name"
              id="followedExchangeName"
              defaultValue={botData.threadConfig.followedExchangeName}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Depth"
              id="depth"
              defaultValue={botData.threadConfig.depth}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Stages"
              id="stages"
              defaultValue={botData.threadConfig.stages}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Price Lever"
              id="priceLever"
              defaultValue={botData.threadConfig.priceLever}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Amount Lever"
              id="amountLever"
              defaultValue={botData.threadConfig.amountLever}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Min Sleep Interval"
              id="minSleepInterval"
              defaultValue={botData.threadConfig.minSleepInterval}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Max Sleep Interval"
              id="maxSleepInterval"
              defaultValue={botData.threadConfig.maxSleepInterval}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Min Amount"
              id="minAmount"
              defaultValue={botData.threadConfig.minAmount}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Max Amount"
              id="maxAmount"
              defaultValue={botData.threadConfig.maxAmount}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Save Orders"
              id="saveOrders"
              defaultValue={botData.threadConfig.saveOrders}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Ask Spread Index"
              id="askSpreadIndex"
              defaultValue={botData.threadConfig.askSpreadIndex}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            <TextField
              fullWidth
              className={classes.marginBottom}
              label="Bid Spread Index"
              id="bidSpreadIndex"
              defaultValue={botData.threadConfig.bidSpreadIndex}
              size="small"
              disabled={editState ? false : true}
              onChange={handleBotChange}
            />
            {!report ? (
              ""
            ) : (
              <>
                <hr />
                <h4>
                  REPORT : {report.base} / {report.counter}
                </h4>
                <div>
                  <strong>Base Volume :</strong>
                  <span>{report.baseVolume}</span>
                </div>
                <div>
                  <strong>Counter Volume :</strong>
                  <span>
                    {report.counterVolume} {report.counter}
                  </span>
                </div>

                <div>
                  <strong>Base Commission :</strong>
                  <span>
                    {report.baseCommission} {report.base}
                  </span>
                </div>
                <div>
                  <strong>Counter Commission :</strong>
                  <span>
                    {report.CounterCommission} {report.counter}
                  </span>
                </div>
                <div>
                  <strong>Average Price :</strong>
                  <span>{report.averagePrice}</span>
                </div>
                <div>
                  <strong>Base Average Price :</strong>
                  <span>
                    {report.baseAveragePrice} {report.base}
                  </span>
                </div>
                <div>
                  <strong>Counter Average Price :</strong>
                  <span>
                    {report.counterAveragePrice} {report.counter}
                  </span>
                </div>
                <div>
                  <strong>Number of Transactions :</strong>
                  <span>{report.numberOfTransactions}</span>
                </div>
              </>
            )}
          </CardContent>
        </Collapse>

        <CardActions disableSpacing>
          {editState ? (
            <Button startIcon={<CloudUploadIcon />} onClick={save} variant="contained" color="primary">
              SAVE
            </Button>
          ) : botData.threadIsRunning ? (
            <StopButton startIcon={<PanTool />} onClick={stopBot} variant="contained">
              {buttonLoading === false ? (
                "STOP"
              ) : (
                <CircularProgress
                  variant="determinate"
                  value={100}
                  className={classes.top}
                  size={24}
                  thickness={4}
                />
              )}
            </StopButton>
          ) : (
            <StartButton startIcon={<PlayArrow />} onClick={startBot} variant="contained">
              {buttonLoading === false ? (
                "START"
              ) : (
                <CircularProgress
                  variant="determinate"
                  value={100}
                  className={classes.top}
                  size={24}
                  thickness={4}
                />
              )}
            </StartButton>
          )}
          <IconButton
            className={classes.reportButton}
            onClick={handleExpandClick}
            aria-expanded={expanded}
          >
            Report{" "}
            <ExpandMoreIcon
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
            />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default DashboardItem;
