import ExternalLink from "@/components/shared/ExternalLink";

export default function Contributor(props) {
    return (
        <li>
            <strong>
                {props.link ? <NameWithLink name={props.name} link={props.link} /> : props.name}
            </strong>: {props.children}
        </li>
    );
}

function NameWithLink(props) {
    return (
      <ExternalLink link={props.link}>{props.name}</ExternalLink>
    );
}