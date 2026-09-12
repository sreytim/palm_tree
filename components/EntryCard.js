import ArchiveCard from "./ArchiveCard";

const cardStyle = {
  border: "1px solid #d9cfbd",
  borderRadius: "16px",
  background: "#fffdf7",
  padding: "24px",
  boxShadow: "0 4px 16px rgba(67, 54, 36, 0.08)",
};

export default function EntryCard({
  item,
  view = "grid",
  title,
  description,
  contributor,
  place,
}) {
  if (item) return <ArchiveCard item={item} view={view} />;

  return (
    <article style={cardStyle}>
      <p style={{ color: "#6b5a3d", fontSize: "0.875rem", margin: 0 }}>
        {place}
      </p>
      <h3 style={{ color: "#2d3a2e", fontSize: "1.25rem", margin: "8px 0" }}>
        {title}
      </h3>
      <p style={{ color: "#4d4a43", lineHeight: 1.6, margin: "0 0 16px" }}>
        {description}
      </p>
      <p style={{ color: "#6b5a3d", fontSize: "0.875rem", margin: 0 }}>
        Contributed by {contributor}
      </p>
    </article>
  );
}
