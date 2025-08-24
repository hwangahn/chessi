export default function AgoText({ timestamp }) {
  function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diffMs = now - new Date(timestamp).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return "just now";
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
    }
  }
  
  return <span>{formatTimeAgo(timestamp)}</span>;
}
