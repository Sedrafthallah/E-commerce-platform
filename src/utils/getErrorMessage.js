export function getErrorMessage(error) {
  if (!error.response) return "Unable to connect to the server";

  const { status, data } = error.response;

  if (status === 422 && data?.errors) {
    return Object.values(data.errors).flat().join(" - ");
  }
  if (status === 403)
    return "You do not have permission to perform this action";
  if (status === 404) return "The requested item was not found";
  if (status >= 500) return "Server error, please try again later";

  return data?.message || "An unexpected error occurred";
}
