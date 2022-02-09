export default function ExternalLink({ link, children }) {
    return (
      <a href={link} target="_blank" rel="external noopener noreferrer">
        {children}
      </a>
    );
}