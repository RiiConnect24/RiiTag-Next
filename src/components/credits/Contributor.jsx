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