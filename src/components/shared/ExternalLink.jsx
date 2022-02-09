export default function ExternalLink(props) {
    return (
      <a href={props.link} target="_blank" rel="external noopener noreferrer">
        {props.children}
      </a>
    );
}