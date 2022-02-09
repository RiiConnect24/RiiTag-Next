import PropTypes from 'prop-types';
import ExternalLink from "@/components/shared/ExternalLink";

export default function NameWithLink({ name, link }) {
    return (
      <ExternalLink link={link}>{name}</ExternalLink>
    );
}

NameWithLink.propTypes = {
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};