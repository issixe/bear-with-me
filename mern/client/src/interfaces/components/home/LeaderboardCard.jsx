import { useLeaderboard } from "../../hooks/useLeaderboard";

const styles = {
  section: {
    minWidth: "280px",
    maxWidth: "340px",
  },
  heading: {
    margin: "0 0 14px",
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#18221d",
  },
  card: {
    backgroundColor: "#e4e7e0",
    borderRadius: "12px",
    padding: "14px 18px",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "20px 1fr auto",
    alignItems: "center",
    gap: "12px",
  },
  rank: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#4f7a63",
    textAlign: "center",
  },
  username: {
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#2c3530",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  points: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#18221d",
    whiteSpace: "nowrap",
  },
  status: {
    margin: 0,
    padding: "8px 0",
    fontSize: "0.9rem",
    color: "#424d47",
  },
  error: {
    margin: 0,
    padding: "8px 0",
    fontSize: "0.9rem",
    color: "#9e2a2b",
  },
};

export function LeaderboardCard({ title = "Leaderboard", topCount = 4 }) {
  const { entries, loading, error } = useLeaderboard(topCount);

  return (
    <section style={styles.section} aria-label={title}>
      <h2 style={styles.heading}>{title}</h2>

      <div style={styles.card}>
        {loading && <p style={styles.status}>Loading...</p>}

        {error && (
          <p style={styles.error} role="alert">
            {error.message || "Could not load leaderboard"}
          </p>
        )}

        {!loading && !error && entries.length === 0 && (
          <p style={styles.status}>No points recorded this week yet.</p>
        )}

        {!loading && !error && entries.length > 0 && (
          <ul style={styles.list}>
            {entries.map((entry, idx) => (
              <li key={entry.userId} style={styles.row}>
                <span style={styles.rank}>{entry.rank ?? idx + 1}</span>
                <span style={styles.username}>{entry.username}</span>
                <span style={styles.points}>{entry.totalPoints} pts</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
