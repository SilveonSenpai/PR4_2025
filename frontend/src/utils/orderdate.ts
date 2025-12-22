export const formatOrderDate = (orderId?: string) => {
  if (!orderId) return "";
  try {
    const timestamp = parseInt(orderId.substring(0, 8), 16) * 1000;
    return new Date(timestamp).toLocaleString("uk-UA", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};
