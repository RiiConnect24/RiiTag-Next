import ExternalLink from "@/components/shared/ExternalLink";

export default function NameWithLink({ name, link }) {
    return (
      <ExternalLink link={link}>{name}</ExternalLink>
    );
}