import PropTypes from 'prop-types';
import NameWithLink from "@/components/credits/NameWithLink";

export default function Contributor({ name, link, children }) {
    return (
        <li>
            <strong>
                {link ? <NameWithLink name={name} link={link} /> : name}
            </strong>: {children}
        </li>
    );
}

Contributor.propTypes = {
    name: PropTypes.string.isRequired,
    link: PropTypes.string,
    children: PropTypes.node.isRequired,
};

Contributor.defaultProps = {
    link: undefined,
};