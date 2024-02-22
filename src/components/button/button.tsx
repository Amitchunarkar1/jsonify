import Button from "@mui/material/Button";

export default function button(props: BTN) {
  return (
    <Button variant="contained" onClick={props.onClick}>
      {props.title}
    </Button>
  );
}
