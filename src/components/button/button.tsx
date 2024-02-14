import '../../assets/css/component.css'
export default function button(props:BTN) {
  return <button class="btn third" onClick={props.onClick} >{props.title}</button>
}

