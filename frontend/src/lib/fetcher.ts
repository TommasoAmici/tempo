export const fetcher = (url: string, apiKey: string) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic " + btoa(apiKey),
    },
  }).then(r => r.json());
