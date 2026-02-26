import { CardWrapper } from './card-wrapper.styled';

function CardWrapperComponent(props: any) {
  return (
    <CardWrapper style={props.style} className={props.className}>
      {props.children}
    </CardWrapper>
  );
}
export default CardWrapperComponent;
